package com.erni.inspector;

import com.sun.source.tree.*;
import com.sun.source.util.*;
import javax.tools.*;
import java.nio.file.*;
import java.util.*;
import java.io.IOException;

/** Parses source syntax only: never loads game classes or runs initializers. */
final class SourceIndex {
    record Field(String name, String type, String modifiers, String initializer, long line) {
        boolean scalar() { return Set.of("byte", "short", "int", "long", "float", "double", "boolean", "char", "String").contains(type); }
    }
    record Creation(String type, String method, long line, String expression, String assignedTo) {}
    record Type(String name, String qualified, String pkg, String kind, Path file, long line,
                String superclass, List<String> parents, List<String> fields, List<String> methods, String doc, List<Field> members, List<Creation> creations, Map<String, String> imports) {
        @Override public String toString() { return name; }
    }
    record Result(List<Type> types, List<String> diagnostics) {}

    static Result scan(Path root) throws IOException {
        var compiler = ToolProvider.getSystemJavaCompiler();
        if (compiler == null) throw new IOException("Для инспектора требуется JDK 21, а не JRE.");
        List<Path> files = new ArrayList<>();
        for (String module : List.of("core", "lwjgl3")) {
            Path src = root.resolve(module + "/src/main/java");
            if (Files.isDirectory(src)) try (var walk = Files.walk(src)) {
                walk.filter(p -> p.toString().endsWith(".java")).sorted().forEach(files::add);
            }
        }
        List<Type> types = new ArrayList<>();
        var diagnostics = new DiagnosticCollector<JavaFileObject>();
        try (var manager = compiler.getStandardFileManager(diagnostics, Locale.ROOT, java.nio.charset.StandardCharsets.UTF_8)) {
            var task = (JavacTask) compiler.getTask(null, manager, diagnostics,
                List.of("-proc:none"), null, manager.getJavaFileObjectsFromPaths(files));
            var docs = DocTrees.instance(task);
            for (var unit : task.parse()) {
                String pkg = unit.getPackageName() == null ? "" : unit.getPackageName().toString();
                Path file = Path.of(unit.getSourceFile().toUri());
                new TreePathScanner<Void, String>() {
                    @Override public Void visitClass(ClassTree node, String outer) {
                        String simple = node.getSimpleName().toString();
                        if (simple.isEmpty()) return null;
                        String name = outer == null ? simple : outer + "." + simple;
                        List<Field> members = new ArrayList<>();
                        List<Creation> creations = new ArrayList<>();
                        Map<String, String> imports = new HashMap<>();
                        unit.getImports().stream().filter(i -> !i.isStatic()).forEach(i -> { String q = i.getQualifiedIdentifier().toString(); imports.put(simple(q), q); });
                        List<String> parents = new ArrayList<>(), fields = new ArrayList<>(), methods = new ArrayList<>();
                        if (node.getExtendsClause() != null) parents.add(node.getExtendsClause().toString());
                        node.getImplementsClause().forEach(p -> parents.add(p.toString()));
                        for (Tree member : node.getMembers()) {
                            if (member instanceof VariableTree v) {
                                fields.add(v.getModifiers() + " " + v.getType() + " " + v.getName());
                                members.add(new Field(v.getName().toString(), String.valueOf(v.getType()), v.getModifiers().toString().strip(), v.getInitializer() == null ? "" : v.getInitializer().toString(), unit.getLineMap().getLineNumber(docs.getSourcePositions().getStartPosition(unit, v))));
                            }
                            if (!(member instanceof ClassTree)) new TreeScanner<Void, Void>() {
                                String assignedTo = "";
                                @Override public Void visitAssignment(AssignmentTree a, Void unused) {
                                    String previous = assignedTo; assignedTo = a.getVariable().toString();
                                    scan(a.getExpression(), null); assignedTo = previous; return null;
                                }
                                @Override public Void visitVariable(VariableTree v, Void unused) {
                                    String previous = assignedTo; assignedTo = v.getName().toString();
                                    scan(v.getInitializer(), null); assignedTo = previous; return null;
                                }
                                @Override public Void visitNewClass(NewClassTree n, Void unused) {
                                    creations.add(new Creation(n.getIdentifier().toString(), member instanceof MethodTree m ? (m.getName().contentEquals("<init>") ? simple + "()" : m.getName() + "()") : "инициализация поля", unit.getLineMap().getLineNumber(docs.getSourcePositions().getStartPosition(unit, n)), n.toString(), assignedTo));
                                    // Do not attribute anonymous-class bodies to the enclosing class.
                                    String previous = assignedTo; assignedTo = "";
                                    n.getArguments().forEach(a -> scan(a, null)); assignedTo = previous; return null;
                                }
                                @Override public Void visitClass(ClassTree n, Void unused) { return null; }
                            }.scan(member, null);
                            if (member instanceof MethodTree m) {
                                String methodName = m.getName().contentEquals("<init>") ? simple : m.getName().toString();
                                methods.add(m.getModifiers() + " " + (m.getReturnType() == null ? "" : m.getReturnType() + " ") + methodName + "(" + String.join(", ", m.getParameters().stream().map(p -> p.getType() + " " + p.getName()).toList()) + ")");
                            }
                        }
                        long pos = docs.getSourcePositions().getStartPosition(unit, node);
                        String doc = docs.getDocComment(getCurrentPath());
                        types.add(new Type(name, pkg.isEmpty() ? name : pkg + "." + name, pkg,
                            node.getModifiers() + " " + node.getKind().name().toLowerCase(Locale.ROOT), file,
                            unit.getLineMap().getLineNumber(pos), node.getExtendsClause() == null ? "" : node.getExtendsClause().toString(), List.copyOf(parents), List.copyOf(fields), List.copyOf(methods), doc == null ? "" : doc, List.copyOf(members), List.copyOf(creations), Map.copyOf(imports)));
                        return super.visitClass(node, name);
                    }
                }.scan(unit, null);
            }
        }
        types.sort(Comparator.comparing(Type::qualified));
        return new Result(List.copyOf(types), diagnostics.getDiagnostics().stream().map(d -> d.getKind() + ": " + d.getMessage(Locale.ROOT)).toList());
    }

    static String simple(String type) {
        String plain = type.replaceAll("<.*>", "");
        return plain.substring(plain.lastIndexOf('.') + 1);
    }
    static Type parent(Type child, String name, List<Type> types) {
        String plain = name.replaceAll("<.*>", "");
        String imported = child.imports().get(plain);
        if (imported != null) return types.stream().filter(t -> t.qualified().equals(imported)).findFirst().orElse(null);
        if (plain.contains(".")) {
            var exact = types.stream().filter(t -> t.qualified().equals(plain)).findFirst();
            if (exact.isPresent()) return exact.get();
        }
        var candidates = types.stream().filter(t -> t.qualified().equals(plain) || t.name().equals(plain) || t.name().equals(simple(plain))).toList();
        return candidates.stream().filter(t -> t.pkg().equals(child.pkg())).findFirst()
            .orElse(candidates.size() == 1 ? candidates.getFirst() : null);
    }
}
