using System;
using System.IO;
using FinalAnswer.App;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;
using UnityEngine.SceneManagement;

namespace FinalAnswer.EditorTools
{
    /// <summary>
    /// Reproducible project configuration. Run from the menu or headless:
    /// Unity -batchmode -projectPath unity/FinalAnswer -executeMethod FinalAnswer.EditorTools.ProjectSetup.Run -quit
    /// </summary>
    public static class ProjectSetup
    {
        const string SettingsFolder = "Assets/FinalAnswer/Settings";
        const string RendererPath = SettingsFolder + "/FinalAnswer_Renderer.asset";
        const string PipelinePath = SettingsFolder + "/FinalAnswer_URP.asset";
        const string BootstrapScene = "Assets/FinalAnswer/Scenes/Bootstrap.unity";
        const string FontPath = "Assets/FinalAnswer/Fonts/NotoSans-Regular.ttf";

        [MenuItem("Final Answer/Configure Project")]
        public static void Run()
        {
            ConfigurePlayer();
            ConfigurePipeline();
            AssetDatabase.Refresh();
            // Re-import so ImportRules applies even to files that arrived before the postprocessor compiled.
            foreach (var folder in new[] { "Assets/FinalAnswer/Art", "Assets/FinalAnswer/Audio" })
                AssetDatabase.ImportAsset(folder, ImportAssetOptions.ImportRecursive | ImportAssetOptions.ForceUpdate);
            var catalog = BuildCatalog();
            CreateBootstrapScene(catalog);
            AssetDatabase.SaveAssets();
            Debug.Log("[FinalAnswer] Project configured");
        }

        [MenuItem("Final Answer/Build macOS")]
        public static void BuildMacOS() => Build(BuildTarget.StandaloneOSX, "Builds/macOS/FinalAnswer.app");

        /// <summary>Development player: F1 solo sandbox and F3 debug overlay are enabled (Debug.isDebugBuild).</summary>
        [MenuItem("Final Answer/Build macOS (Developer)")]
        public static void BuildMacOSDeveloper() => Build(BuildTarget.StandaloneOSX, "Builds/macOS-Dev/FinalAnswer Dev.app", BuildOptions.Development);

        public static void BuildWindows() => Build(BuildTarget.StandaloneWindows64, "Builds/Windows/FinalAnswer.exe");

        static void ConfigurePlayer()
        {
            PlayerSettings.companyName = "Erni";
            PlayerSettings.productName = "Final Answer";
            PlayerSettings.colorSpace = ColorSpace.Linear;
            PlayerSettings.runInBackground = true;
            PlayerSettings.defaultScreenWidth = 1920;
            PlayerSettings.defaultScreenHeight = 1080;
            PlayerSettings.fullScreenMode = FullScreenMode.Windowed;
            PlayerSettings.resizableWindow = true;
            PlayerSettings.SetApiCompatibilityLevel(UnityEditor.Build.NamedBuildTarget.Standalone, ApiCompatibilityLevel.NET_Standard);

            // Input System only (UNITY_ARCHITECTURE §5). No public API exists for this switch.
            var project = AssetDatabase.LoadAllAssetsAtPath("ProjectSettings/ProjectSettings.asset");
            if (project.Length > 0)
            {
                var serialized = new SerializedObject(project[0]);
                var handler = serialized.FindProperty("activeInputHandler");
                if (handler != null && handler.intValue != 1)
                {
                    handler.intValue = 1;
                    serialized.ApplyModifiedPropertiesWithoutUndo();
                }
            }
        }

        static void ConfigurePipeline()
        {
            Directory.CreateDirectory(SettingsFolder);
            var renderer = AssetDatabase.LoadAssetAtPath<UniversalRendererData>(RendererPath);
            if (renderer == null)
            {
                renderer = ScriptableObject.CreateInstance<UniversalRendererData>();
                AssetDatabase.CreateAsset(renderer, RendererPath);
            }
            var pipeline = AssetDatabase.LoadAssetAtPath<UniversalRenderPipelineAsset>(PipelinePath);
            if (pipeline == null)
            {
                pipeline = UniversalRenderPipelineAsset.Create(renderer);
                AssetDatabase.CreateAsset(pipeline, PipelinePath);
            }
            GraphicsSettings.defaultRenderPipeline = pipeline;
            var current = QualitySettings.GetQualityLevel();
            for (var i = 0; i < QualitySettings.names.Length; i++)
            {
                QualitySettings.SetQualityLevel(i, false);
                QualitySettings.renderPipeline = pipeline;
            }
            QualitySettings.SetQualityLevel(current, false);
        }

        const string CatalogPath = "Assets/FinalAnswer/Settings/ArtCatalog.asset";
        static readonly string[] CatalogFolders = { "Art", "Audio", "Fonts", "Localization", "UI/Shaders" };

        /// <summary>Serialized references for every shell asset; keys = path under Assets/FinalAnswer without extension (TextAssets keep it).</summary>
        public static FinalAnswer.UI.ArtCatalog BuildCatalog()
        {
            var catalog = AssetDatabase.LoadAssetAtPath<FinalAnswer.UI.ArtCatalog>(CatalogPath);
            if (catalog == null)
            {
                catalog = ScriptableObject.CreateInstance<FinalAnswer.UI.ArtCatalog>();
                AssetDatabase.CreateAsset(catalog, CatalogPath);
            }
            var entries = new System.Collections.Generic.List<FinalAnswer.UI.ArtCatalog.Entry>();
            foreach (var folder in CatalogFolders)
            {
                foreach (var guid in AssetDatabase.FindAssets("", new[] { "Assets/FinalAnswer/" + folder }))
                {
                    var path = AssetDatabase.GUIDToAssetPath(guid);
                    if (AssetDatabase.IsValidFolder(path)) continue;
                    var asset = AssetDatabase.LoadMainAssetAtPath(path);
                    if (asset == null) continue;
                    var relative = path.Substring("Assets/FinalAnswer/".Length);
                    var key = asset is TextAsset ? relative : relative.Substring(0, relative.Length - Path.GetExtension(relative).Length);
                    if (asset is Texture2D || asset is AudioClip || asset is Font || asset is TextAsset || asset is Shader)
                        entries.Add(new FinalAnswer.UI.ArtCatalog.Entry { key = key, asset = asset });
                }
            }
            entries.Sort((a, b) => string.CompareOrdinal(a.key, b.key));
            catalog.SetEntries(entries);
            EditorUtility.SetDirty(catalog);
            AssetDatabase.SaveAssets();
            Debug.Log("[FinalAnswer] Art catalog: " + entries.Count + " assets");
            return catalog;
        }

        static void CreateBootstrapScene(FinalAnswer.UI.ArtCatalog catalog)
        {
            Directory.CreateDirectory(Path.GetDirectoryName(BootstrapScene));
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var root = new GameObject("AppRoot");
            var app = root.AddComponent<AppRoot>();
            var font = AssetDatabase.LoadAssetAtPath<Font>(FontPath);
            if (font == null) throw new InvalidOperationException("Missing UI font " + FontPath);
            var serialized = new SerializedObject(app);
            serialized.FindProperty("uiFont").objectReferenceValue = font;
            // Reload by path: the instance from BuildCatalog may not survive NewScene's unload.
            var catalogAsset = AssetDatabase.LoadAssetAtPath<FinalAnswer.UI.ArtCatalog>(CatalogPath);
            serialized.FindProperty("art").objectReferenceValue = catalogAsset;
            serialized.ApplyModifiedPropertiesWithoutUndo();
            if (catalogAsset == null || new SerializedObject(app).FindProperty("art").objectReferenceValue == null)
                throw new InvalidOperationException("ArtCatalog was not assigned to AppRoot");
            EditorSceneManager.SaveScene(scene, BootstrapScene);
            EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(BootstrapScene, true) };
        }

        static void Build(BuildTarget target, string output, BuildOptions options = BuildOptions.None)
        {
            var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
            {
                scenes = new[] { BootstrapScene },
                locationPathName = output,
                target = target,
                options = options,
            });
            var summary = report.summary;
            Debug.Log("[FinalAnswer] Build " + summary.result + " · " + summary.totalErrors + " errors · " + summary.outputPath);
            if (summary.result != BuildResult.Succeeded && UnityEngine.Application.isBatchMode) EditorApplication.Exit(1);
        }
    }
}
