package com.erni.inspector;

import javax.swing.*;
import javax.swing.event.*;
import javax.swing.tree.*;
import java.awt.*;
import java.awt.event.*;
import java.nio.file.*;
import java.util.*;
import java.util.List;

/** Read-only developer window, deliberately separate from the libGDX lifecycle. */
public final class Inspector {
    private final Path root;
    private final LiveBrowser live;
    private final JFrame frame = new JFrame("FinalAnswer · Developer Inspector");
    private final JTextField search = new JTextField();
    private final JTree tree = new JTree();
    private final JTextArea details = new JTextArea();
    private final JLabel status = new JLabel("Чтение исходников…");
    private final MemberView members = new MemberView(this::select);
    private final StructureMap structure = new StructureMap(this::select);
    private final java.util.ArrayDeque<String> history = new java.util.ArrayDeque<>();
    private final JButton back = new JButton("← Назад");
    private boolean navigatingBack;
    private boolean rebuildingTree;
    private boolean loading, pendingReload, closed;
    private SourceMonitor monitor;
    private final JDialog classWindow = new JDialog(frame, "Содержимое класса", false);
    private final Diagram diagram = new Diagram(this::select);
    private List<SourceIndex.Type> types = List.of();
    private SourceIndex.Type selected;
    private final JButton refresh = new JButton("Обновить");

    private Inspector(Path root, Path snapshot) {
        this.root = root;
        live = new LiveBrowser(frame, snapshot);
        frame.setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
        frame.setMinimumSize(new Dimension(1000, 640));
        frame.setSize(1440, 860);
        JPanel top = new JPanel(new BorderLayout(16, 8));
        top.setBorder(BorderFactory.createEmptyBorder(16, 18, 16, 18));
        JLabel title = new JLabel("FINAL ANSWER  /  CODE EXPLORER");
        title.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 18));
        top.add(title, BorderLayout.WEST);
        search.putClientProperty("JTextField.placeholderText", "Поиск класса или пакета");
        search.setToolTipText("Поиск по имени класса и полному имени пакета");
        JPanel tools = new JPanel(new BorderLayout(8, 0));
        tools.add(new JLabel("Поиск:"), BorderLayout.WEST);
        tools.add(search); tools.add(refresh, BorderLayout.EAST);
        top.add(tools);
        frame.add(top, BorderLayout.NORTH);
        tree.setRootVisible(false);
        tree.addTreeSelectionListener(e -> {
            Object node = tree.getLastSelectedPathComponent();
            if (!rebuildingTree && node instanceof DefaultMutableTreeNode n && n.getUserObject() instanceof SourceIndex.Type t) select(t);
        });
        details.setEditable(false); details.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));
        details.setMargin(new Insets(16, 16, 16, 16));
        JPanel info = new JPanel(new BorderLayout());
        info.add(new JScrollPane(details));
        JButton open = new JButton("Открыть исходник");
        open.addActionListener(e -> openSource()); info.add(open, BorderLayout.SOUTH);
        JPanel graph = new JPanel(new BorderLayout());
        JPanel graphTools = new JPanel(new FlowLayout(FlowLayout.LEFT));
        for (String label : List.of("−", "+", "100%", "Вписать")) {
            JButton b = new JButton(label);
            b.addActionListener(e -> diagram.zoom(label)); graphTools.add(b);
        }
        graphTools.add(new JLabel("Сплошная линия: наследование   ·   Пунктир: интерфейс   ·   Серый: библиотека"));
        graph.add(graphTools, BorderLayout.NORTH); graph.add(new JScrollPane(diagram)); graph.add(live, BorderLayout.SOUTH);
        JTabbedPane views = new JTabbedPane();
        views.addTab("Поля и методы", members);
        views.addTab("Карта связей", structure);
                views.addTab("Сведения и исходник", info);
        JPanel navigation = new JPanel(new FlowLayout(FlowLayout.LEFT));
        back.setEnabled(false);
        back.addActionListener(e -> {
            if (!history.isEmpty()) {
                String previous = history.pop(); navigatingBack = true;
                types.stream().filter(t -> t.qualified().equals(previous)).findFirst().ifPresent(this::select);
                navigatingBack = false; back.setEnabled(!history.isEmpty());
            }
        });
        JPanel popupNavigation = new JPanel(new FlowLayout(FlowLayout.LEFT));
        popupNavigation.add(back);
        JButton classInfo = new JButton("Сведения о классе");
        classInfo.addActionListener(e -> { if (selected != null) { classWindow.setLocationRelativeTo(frame); classWindow.setVisible(true); classWindow.toFront(); } });
        navigation.add(classInfo);
        navigation.add(new JLabel("Нажмите класс на схеме → откроется его содержимое · Исходники обновляются автоматически"));
        JPanel popupContent = new JPanel(new BorderLayout()); popupContent.add(popupNavigation, BorderLayout.NORTH); popupContent.add(views);
        classWindow.setContentPane(popupContent); classWindow.setSize(1120, 800);
        classWindow.setMinimumSize(new Dimension(850, 560));
        classWindow.setDefaultCloseOperation(WindowConstants.HIDE_ON_CLOSE);
        JPanel workspace = new JPanel(new BorderLayout()); workspace.add(navigation, BorderLayout.NORTH); workspace.add(graph);
        JSplitPane all = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, new JScrollPane(tree), workspace);
        all.setDividerLocation(260); frame.add(all);
        status.setBorder(BorderFactory.createEmptyBorder(10, 18, 10, 18)); frame.add(status, BorderLayout.SOUTH);
        search.getDocument().addDocumentListener(new DocumentListener() {
            public void insertUpdate(DocumentEvent e) { filter(); }
            public void removeUpdate(DocumentEvent e) { filter(); }
            public void changedUpdate(DocumentEvent e) { filter(); }
        });
        refresh.addActionListener(e -> reload());
        frame.getRootPane().registerKeyboardAction(e -> reload(), KeyStroke.getKeyStroke("F5"), JComponent.WHEN_IN_FOCUSED_WINDOW);
        frame.addWindowListener(new WindowAdapter() {
            @Override public void windowClosed(WindowEvent e) {
                closed = true; live.close(); if (monitor != null) monitor.close(); classWindow.dispose();
            }
        });
        frame.setLocationRelativeTo(null); frame.setVisible(true); reload();
        monitor = new SourceMonitor(root, () -> SwingUtilities.invokeLater(this::reload),
            ex -> SwingUtilities.invokeLater(() -> { if (!closed) status.setText("Автообновление: не удалось прочитать файл · " + ex.getMessage()); }));
    }
    private void reload() {
        if (closed) return;
        if (loading) { pendingReload = true; return; }
        loading = true;
        refresh.setEnabled(false); status.setText("Чтение Java-исходников…");
        new SwingWorker<SourceIndex.Result, Void>() {
            protected SourceIndex.Result doInBackground() throws Exception { return SourceIndex.scan(root); }
            protected void done() {
                if (closed) return;
                try {
                    var result = get(); types = result.types(); structure.setTypes(types); members.setTypes(types); filter();
                    if (selected != null) types.stream().filter(t -> t.qualified().equals(selected.qualified())).findFirst().ifPresentOrElse(Inspector.this::updateSelection, () -> { selected = null; details.setText(""); structure.showType(null); members.showType(null); classWindow.setVisible(false); });
                    else if (!types.isEmpty()) updateSelection(types.stream().filter(t -> t.name().equals("FinalAnswerGame")).findFirst().orElse(types.getFirst()));
                    status.setText(types.size() + " классов · Автообновление включено · Только чтение · " + root + (result.diagnostics().isEmpty() ? "" : " · Ошибки синтаксиса: " + result.diagnostics().size()));
                    status.setToolTipText(String.join(" | ", result.diagnostics()));
                } catch (Exception ex) { status.setText("Не удалось прочитать исходники: " + ex.getMessage()); }
                finally { loading = false; refresh.setEnabled(true); if (pendingReload) { pendingReload = false; reload(); } }
            }
        }.execute();
    }
    private void filter() {
        String query = search.getText().strip().toLowerCase(Locale.ROOT);
        List<SourceIndex.Type> visible = types.stream().filter(t -> t.qualified().toLowerCase(Locale.ROOT).contains(query)).toList();
        DefaultMutableTreeNode rootNode = new DefaultMutableTreeNode("Project");
        Map<String, DefaultMutableTreeNode> packages = new LinkedHashMap<>();
        for (var t : visible) {
            var node = packages.computeIfAbsent(t.pkg(), p -> { var n = new DefaultMutableTreeNode(p); rootNode.add(n); return n; });
            node.add(new DefaultMutableTreeNode(t));
        }
        rebuildingTree = true;
        tree.setModel(new DefaultTreeModel(rootNode));
        for (int i = 0; i < tree.getRowCount(); i++) tree.expandRow(i);
        if (selected != null) {
            var nodes = rootNode.depthFirstEnumeration();
            while (nodes.hasMoreElements()) {
                var node = (DefaultMutableTreeNode) nodes.nextElement();
                if (node.getUserObject() instanceof SourceIndex.Type t && t.qualified().equals(selected.qualified())) {
                    tree.setSelectionPath(new TreePath(node.getPath())); break;
                }
            }
        }
        rebuildingTree = false;
        diagram.setTypes(visible, types);
    }
    private void select(SourceIndex.Type t) {
        updateSelection(t);
        if (live.isLiveMode()) return;
        if (!classWindow.isVisible()) classWindow.setLocationRelativeTo(frame);
        classWindow.setVisible(true); classWindow.toFront();
    }
    private void updateSelection(SourceIndex.Type t) {
        classWindow.setTitle(t.name() + " · Содержимое класса");
        if (selected != null && !selected.qualified().equals(t.qualified()) && !navigatingBack) history.push(selected.qualified());
        back.setEnabled(!history.isEmpty());
        selected = t; live.selectClass(t.qualified()); structure.showType(t); members.showType(t);
        rebuildingTree = true;
        var nodes = ((DefaultMutableTreeNode) tree.getModel().getRoot()).depthFirstEnumeration();
        while (nodes.hasMoreElements()) {
            var node = (DefaultMutableTreeNode) nodes.nextElement();
            if (node.getUserObject() instanceof SourceIndex.Type item && item.qualified().equals(t.qualified())) {
                tree.setSelectionPath(new TreePath(node.getPath())); break;
            }
        }
        rebuildingTree = false;
        diagram.selected = t.qualified(); diagram.repaint();
        StringBuilder text = new StringBuilder(t.name() + "\n" + t.kind().strip() + "\n\n" + t.pkg() + "\n" + root.relativize(t.file()) + ":" + t.line() + "\n");
        if (!t.doc().isBlank()) text.append("\nОПИСАНИЕ\n").append(t.doc()).append("\n");
        text.append("\nРОДИТЕЛИ / ИНТЕРФЕЙСЫ\n").append(t.parents().isEmpty() ? "—" : String.join("\n", t.parents()));
        text.append("\n\nНАСЛЕДНИКИ\n");
        var children = types.stream().filter(c -> c.parents().stream().anyMatch(p -> t.equals(SourceIndex.parent(c, p, types)))).map(SourceIndex.Type::qualified).toList();
        text.append(children.isEmpty() ? "—" : String.join("\n", children));
        text.append("\n\nПОЛЯ (объявленные)\n").append(t.fields().isEmpty() ? "—" : String.join("\n", t.fields()));
        text.append("\n\nМЕТОДЫ И КОНСТРУКТОРЫ\n").append(t.methods().isEmpty() ? "—" : String.join("\n\n", t.methods()));
        details.setText(text.toString()); details.setCaretPosition(0);
    }
    private void openSource() {
        if (selected == null) return;
        try {
            new ProcessBuilder("code", "--goto", selected.file() + ":" + selected.line()).start();
        } catch (Exception noCode) {
            try { Desktop.getDesktop().open(selected.file().toFile()); }
            catch (Exception ex) { JOptionPane.showMessageDialog(frame, selected.file() + ":" + selected.line(), "Исходный файл", JOptionPane.INFORMATION_MESSAGE); }
        }
    }
    public static void main(String[] args) {
        Path root = Path.of(args.length == 0 ? "." : args[0]).toAbsolutePath().normalize();
        SwingUtilities.invokeLater(() -> {
            try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception ignored) {}
            new Inspector(root, args.length > 1 ? Path.of(args[1]) : null);
        });
    }
}
