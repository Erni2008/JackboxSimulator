package com.erni.inspector;

import javax.swing.*;
import javax.swing.event.*;
import javax.swing.border.*;
import java.awt.*;
import java.util.*;
import java.util.List;
import java.util.function.Consumer;

/** Compact read-only attributes/operations browser, mirroring a traditional inspector. */
final class MemberView extends JPanel {
    private final JTextField search = new JTextField();
    private final JLabel title = new JLabel();
    private final JPanel sections = new JPanel();
    private final Map<String, Boolean> expanded = new HashMap<>();
    private final Consumer<SourceIndex.Type> navigate;
    private List<SourceIndex.Type> types = List.of();
    private SourceIndex.Type current;
    MemberView(Consumer<SourceIndex.Type> navigate) {
        super(new BorderLayout()); this.navigate = navigate;
        JPanel heading = new JPanel(new BorderLayout(0, 10)); heading.setBorder(new EmptyBorder(12, 14, 12, 14));
        heading.add(new JLabel("Найти поле / метод:"), BorderLayout.WEST); heading.add(search);
        title.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 22)); heading.add(title, BorderLayout.SOUTH); add(heading, BorderLayout.NORTH);
        sections.setLayout(new BoxLayout(sections, BoxLayout.Y_AXIS)); sections.setBackground(Color.WHITE);
        JScrollPane scroll = new JScrollPane(sections); scroll.getVerticalScrollBar().setUnitIncrement(20); add(scroll);
        JLabel hint = new JLabel("Только чтение · Справа — выражения из кода, не текущие значения игры · ↗ открыть тип");
        hint.setBorder(new EmptyBorder(10, 14, 10, 14)); add(hint, BorderLayout.SOUTH);
        search.getDocument().addDocumentListener(new DocumentListener() {
            public void insertUpdate(DocumentEvent e) { rebuild(); }
            public void removeUpdate(DocumentEvent e) { rebuild(); }
            public void changedUpdate(DocumentEvent e) { rebuild(); }
        });
    }
    void setTypes(List<SourceIndex.Type> types) { this.types = types; }
    void showType(SourceIndex.Type type) { current = type; rebuild(); }
    private void rebuild() {
        sections.removeAll();
        if (current == null) { title.setText(""); sections.revalidate(); sections.repaint(); return; }
        title.setText("Класс " + current.name());
        addFields(current, "Поля", true);
        List<SourceIndex.Type> ancestors = new ArrayList<>(); Set<String> visited = new HashSet<>();
        SourceIndex.Type ancestor = current;
        while (!ancestor.superclass().isBlank()) {
            ancestor = SourceIndex.parent(ancestor, ancestor.superclass(), types);
            if (ancestor == null || !visited.add(ancestor.qualified())) break;
            ancestors.add(ancestor); addFields(ancestor, "Поля родителя " + ancestor.name(), false);
        }
        addMethods(current, "Методы и конструкторы", true);
        for (var parent : ancestors) addMethods(parent, "Методы родителя " + parent.name() + " (объявленные)", false);
        if (!current.parents().isEmpty()) {
            JPanel parents = new JPanel(new FlowLayout(FlowLayout.LEFT)); parents.add(new JLabel("Родители / интерфейсы:"));
            for (String p : current.parents()) {
                var resolved = SourceIndex.parent(current, p, types); JButton button = new JButton(p + " ↗");
                button.setEnabled(resolved != null); button.addActionListener(e -> navigate.accept(resolved)); parents.add(button);
            }
            parents.setMaximumSize(new Dimension(Integer.MAX_VALUE, parents.getPreferredSize().height)); sections.add(parents);
        }
        sections.revalidate(); sections.repaint();
    }
    private boolean matches(String text) { return text.toLowerCase(Locale.ROOT).contains(search.getText().strip().toLowerCase(Locale.ROOT)); }
    private void addFields(SourceIndex.Type owner, String name, boolean defaultOpen) {
        JPanel rows = rows(); int count = 0;
        for (var field : owner.members()) {
            String signature = field.modifiers() + " " + field.type() + " " + field.name();
            if (!matches(signature + " " + field.initializer())) continue;
            JPanel row = row(count++); JLabel declaration = new JLabel(signature.strip()); declaration.setToolTipText(signature); row.add(declaration);
            JPanel value = new JPanel(new BorderLayout(8, 0)); value.setOpaque(false);
            String expression = field.initializer().isBlank() ? "Не задано в объявлении" : field.initializer();
            // A constructor assignment is source evidence, not a computed runtime value.
            if (field.initializer().isBlank()) {
                var creations = owner.creations().stream().filter(c -> c.assignedTo().equals(field.name()) || c.assignedTo().equals("this." + field.name())).toList();
                if (!creations.isEmpty()) expression = creations.getFirst().expression() + " · " + creations.getFirst().method();
            }
            JTextField displayed = new JTextField(expression.replaceAll("\\s+", " ")); displayed.setEditable(false); displayed.setToolTipText(expression);
            value.add(displayed);
            var target = SourceIndex.parent(owner, field.type().replace("[]", ""), types);
            JButton inspect = new JButton("↗"); inspect.setEnabled(target != null); inspect.setToolTipText(target == null ? "Тип вне исходников проекта" : "Открыть " + target.qualified());
            inspect.addActionListener(e -> navigate.accept(target)); value.add(inspect, BorderLayout.EAST);
            row.add(value, BorderLayout.EAST); value.setPreferredSize(new Dimension(380, 30)); rows.add(row);
        }
        addSection(owner.qualified() + "/fields", name, count, rows, new Color(198, 75, 56), defaultOpen);
    }
    private void addMethods(SourceIndex.Type owner, String name, boolean defaultOpen) {
        JPanel rows = rows(); int count = 0;
        for (String method : owner.methods()) if (matches(method)) {
            JPanel row = row(count++); JLabel label = new JLabel(method.strip()); label.setToolTipText(method); row.add(label);
            JLabel badge = new JLabel("  декларация  "); badge.setForeground(new Color(108, 124, 143)); row.add(badge, BorderLayout.EAST); rows.add(row);
        }
        addSection(owner.qualified() + "/methods", name, count, rows, new Color(30, 143, 190), defaultOpen);
    }
    private JPanel rows() { JPanel panel = new JPanel(); panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS)); panel.setAlignmentX(Component.LEFT_ALIGNMENT); return panel; }
    private JPanel row(int index) {
        JPanel row = new JPanel(new BorderLayout(12, 0)); row.setBackground(index % 2 == 0 ? Color.WHITE : new Color(229, 235, 240));
        row.setBorder(new CompoundBorder(new MatteBorder(0, 0, 1, 0, new Color(199, 209, 219)), new EmptyBorder(8, 18, 8, 14)));
        row.setAlignmentX(Component.LEFT_ALIGNMENT);
        row.setPreferredSize(new Dimension(900, 46)); row.setMaximumSize(new Dimension(Integer.MAX_VALUE, 46)); return row;
    }
    private void addSection(String key, String name, int count, JPanel rows, Color color, boolean defaultOpen) {
        boolean filtering = !search.getText().isBlank();
        if (filtering && count == 0) return;
        boolean open = filtering || expanded.getOrDefault(key, defaultOpen);
        JButton header = new JButton((open ? "▾  " : "▸  ") + name + "  ·  " + count);
        header.setAlignmentX(Component.LEFT_ALIGNMENT);
        header.setUI(new javax.swing.plaf.basic.BasicButtonUI());
        header.setHorizontalAlignment(SwingConstants.LEFT); header.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 16));
        header.setOpaque(true); header.setContentAreaFilled(true); header.setBackground(color); header.setForeground(Color.WHITE);
        header.setBorder(new EmptyBorder(12, 18, 12, 18)); header.setMaximumSize(new Dimension(Integer.MAX_VALUE, 48));
        header.addActionListener(e -> { expanded.put(key, !expanded.getOrDefault(key, defaultOpen)); rebuild(); });
        sections.add(header); rows.setVisible(open); sections.add(rows);
        if (count == 0) { JLabel empty = new JLabel("    Нет объявлений"); empty.setBorder(new EmptyBorder(10, 0, 10, 0)); rows.add(empty); }
    }
}
