package com.erni.inspector;

import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.util.List;
import java.util.*;
import java.util.function.Consumer;

/** Visual source-level containment map. Each field is an explicit connection port. */
final class StructureMap extends JPanel {
    private static final Color INK = new Color(36, 49, 75), BLUE = new Color(66, 99, 218), GREEN = new Color(36, 135, 114);
    private final Consumer<SourceIndex.Type> select;
    private List<SourceIndex.Type> types = List.of();
    private SourceIndex.Type current;
    private final List<Connection> connections = new ArrayList<>();
    private final JPanel canvas = new JPanel(null) {
        @Override protected void paintComponent(Graphics graphics) {
            super.paintComponent(graphics);
            var g = (Graphics2D) graphics.create();
            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            for (var c : connections) {
                Point a = SwingUtilities.convertPoint(c.from, c.from.getWidth(), c.from.getHeight() / 2, this);
                Point b = SwingUtilities.convertPoint(c.to, 0, c.to.getHeight() / 2, this);
                g.setColor(c.color); g.setStroke(new BasicStroke(2));
                var path = new java.awt.geom.Path2D.Double(); path.moveTo(a.x, a.y);
                path.curveTo(a.x + 50, a.y, b.x - 50, b.y, b.x, b.y); g.draw(path);
                g.fillPolygon(new int[]{b.x, b.x - 8, b.x - 8}, new int[]{b.y, b.y - 5, b.y + 5}, 3);
            }
            g.dispose();
        }
    };
    private record Connection(JComponent from, JComponent to, Color color) {}
    StructureMap(Consumer<SourceIndex.Type> select) {
        super(new BorderLayout()); this.select = select;
        canvas.setBackground(new Color(245, 247, 251));
        add(new JScrollPane(canvas));
    }
    void setTypes(List<SourceIndex.Type> types) { this.types = types; }
    void showType(SourceIndex.Type t) { current = t; rebuild(); }
    private void rebuild() {
        canvas.removeAll(); connections.clear();
        if (current == null) { canvas.revalidate(); canvas.repaint(); return; }
        JLabel heading = new JLabel("Что находится внутри " + current.name() + "?");
        heading.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 22)); heading.setForeground(INK); heading.setBounds(28, 16, 950, 34); canvas.add(heading);
        JLabel legend = new JLabel("Синий → поле хранит ссылку / элементы коллекции     Зелёный → код создаёт объект     Нажмите карточку, чтобы заглянуть внутрь");
        legend.setForeground(new Color(100, 113, 135)); legend.setBounds(28, 52, 1080, 28); canvas.add(legend);
        JPanel source = card(current.name(), current.pkg()); source.setBounds(28, 104, 400, 100);
        JLabel note = label("КЛАСС · структура исходников, не живой объект", 11, false); source.add(note);
        canvas.add(source);
        int targetY = 104;
        List<SourceIndex.Field> references = current.members().stream().filter(f -> !f.scalar()).toList();
        Map<SourceIndex.Field, String> inherited = new LinkedHashMap<>();
        Set<String> ancestors = new HashSet<>();
        SourceIndex.Type ancestor = current;
        while (!ancestor.superclass().isBlank()) {
            ancestor = SourceIndex.parent(ancestor, ancestor.superclass(), types);
            if (ancestor == null || !ancestors.add(ancestor.qualified())) break;
            for (var f : ancestor.members()) inherited.putIfAbsent(f, ancestor.name());
        }
        var allReferences = new ArrayList<>(references);
        inherited.keySet().stream().filter(f -> !f.scalar()).forEach(allReferences::add);
        source.add(section("ОБЪЕКТЫ И КОЛЛЕКЦИИ · " + allReferences.size()));
        if (references.isEmpty()) source.add(label("Собственных объектных полей не объявлено", 13, false));
        for (var f : allReferences) {
            if (inherited.containsKey(f)) source.add(label("Объявлено в " + inherited.get(f) + " · доступ зависит от модификатора", 10, false));
            JPanel port = fieldRow(f, BLUE); source.add(port);
            String typeName = f.type().replace("[]", "");
            // Every generic argument is represented; e.g. Map<Key, Value> has two target cards.
            var tokens = typeName.split("[<>, ?&]+|\\bextends\\b|\\bsuper\\b");
            LinkedHashSet<String> targets = new LinkedHashSet<>();
            for (var token : tokens) if (!token.isBlank() && !Set.of("byte","short","int","long","float","double","boolean","char").contains(token)) targets.add(token);
            for (String target : targets) {
                var owner = inherited.containsKey(f) ? types.stream().filter(t -> t.name().equals(inherited.get(f))).findFirst().orElse(current) : current;
                var resolved = SourceIndex.parent(owner, target, types);
                JPanel destination = targetCard(target, resolved, f.type().contains("<") && !target.equals(tokens[0]) ? "Элемент / аргумент типа поля " + f.name() : "Тип поля " + f.name(), BLUE);
                int h = destination.getPreferredSize().height;
                destination.setBounds(580, targetY, 370, h); canvas.add(destination);
                connections.add(new Connection(port, destination, BLUE)); targetY += h + 20;
            }
        }
        source.add(section("ДАННЫЕ И НАСТРОЙКИ"));
        var scalars = current.members().stream().filter(SourceIndex.Field::scalar).toList();
        if (scalars.isEmpty()) source.add(label("Скалярных полей не объявлено", 13, false));
        scalars.forEach(f -> source.add(fieldRow(f, new Color(145, 105, 49))));
        inherited.forEach((f, owner) -> { if (f.scalar()) { source.add(label("Объявлено в " + owner, 10, false)); source.add(fieldRow(f, new Color(145, 105, 49))); } });
        source.add(section("ЧТО СОЗДАЁТ ЭТОТ КЛАСС"));
        Map<String, List<SourceIndex.Creation>> creations = new LinkedHashMap<>();
        current.creations().forEach(c -> creations.computeIfAbsent(c.type(), k -> new ArrayList<>()).add(c));
        if (creations.isEmpty()) source.add(label("Вызовов new не найдено", 13, false));
        for (var entry : creations.entrySet()) {
            JPanel port = new JPanel(); port.setLayout(new BoxLayout(port, BoxLayout.Y_AXIS));
            port.setBackground(new Color(232, 246, 240)); port.setBorder(new EmptyBorder(9, 10, 9, 10));
            port.add(label("new " + entry.getKey(), 14, true));
            for (var c : entry.getValue()) {
                port.add(label(c.method() + " · строка " + c.line() + (c.assignedTo().isBlank() ? "" : " → " + c.assignedTo()), 11, false));
                String expression = c.expression().replaceAll("\\s+", " ");
                JLabel snippet = label(expression.length() > 48 ? expression.substring(0, 45) + "…" : expression, 10, false);
                snippet.setToolTipText(c.expression()); port.add(snippet);
            }
            source.add(port); source.add(Box.createVerticalStrut(6));
            var resolved = SourceIndex.parent(current, entry.getKey(), types);
            JPanel destination = targetCard(entry.getKey(), resolved, "Создаётся в коде · наличие new не означает хранение в поле", GREEN);
            int h = destination.getPreferredSize().height; destination.setBounds(580, targetY, 370, h); canvas.add(destination);
            connections.add(new Connection(port, destination, GREEN)); targetY += h + 20;
        }
        if (!current.parents().isEmpty()) {
            source.add(section("ОТ КОГО НАСЛЕДУЕТСЯ"));
            for (String p : current.parents()) {
                var resolved = SourceIndex.parent(current, p, types);
                JButton parent = new JButton(p + (resolved == null ? " · библиотека" : " → открыть"));
                parent.setEnabled(resolved != null); parent.addActionListener(e -> select.accept(resolved)); source.add(parent);
            }
            source.add(label("Выше показаны собственные поля; у родителей могут быть дополнительные.", 10, false));
        }
        source.add(section("МЕТОДЫ И КОНСТРУКТОРЫ · " + current.methods().size()));
        JPanel methods = new JPanel(); methods.setLayout(new BoxLayout(methods, BoxLayout.Y_AXIS)); methods.setOpaque(false); methods.setVisible(false);
        current.methods().forEach(m -> { JLabel l = label(m.strip(), 12, false); l.setToolTipText(m); methods.add(l); });
        JButton toggle = new JButton("Показать методы");
        toggle.addActionListener(e -> { methods.setVisible(!methods.isVisible()); toggle.setText(methods.isVisible() ? "Скрыть методы" : "Показать методы"); sizeSource(source); });
        source.add(toggle); source.add(methods);
        sizeSource(source);
        canvas.setPreferredSize(new Dimension(1000, Math.max(targetY + 32, source.getY() + source.getHeight() + 32)));
        canvas.revalidate(); canvas.repaint();
    }
    private void sizeSource(JPanel source) {
        source.setSize(400, source.getPreferredSize().height);
        canvas.setPreferredSize(new Dimension(1000, Math.max(canvas.getPreferredSize().height, source.getY() + source.getHeight() + 32)));
        canvas.revalidate(); canvas.repaint();
    }
    private JPanel targetCard(String name, SourceIndex.Type t, String context, Color color) {
        JPanel p = card(SourceIndex.simple(name), t == null ? "Внешний тип / библиотека" : t.pkg());
        p.setBorder(new CompoundBorder(new LineBorder(color, 1, true), new EmptyBorder(12, 14, 12, 14)));
        JLabel contextLabel = label(context, 11, false); contextLabel.setToolTipText(context); p.add(contextLabel);
        if (t != null) {
            p.add(section("ВНУТРИ: " + t.members().size() + " собственных полей · " + t.methods().size() + " методов"));
            t.members().stream().limit(5).forEach(f -> p.add(label(f.name() + " : " + f.type(), 12, false)));
            if (!t.parents().isEmpty()) p.add(label("Родитель: " + String.join(", ", t.parents()), 11, false));
            if (t.members().size() > 5) p.add(label("Ещё " + (t.members().size() - 5) + " полей…", 11, false));
            JButton open = new JButton("Заглянуть внутрь →"); open.addActionListener(e -> select.accept(t)); p.add(open);
        } else p.add(label("Исходники этого типа вне проекта", 11, false));
        return p;
    }
    private JPanel fieldRow(SourceIndex.Field f, Color color) {
        JPanel row = new JPanel(); row.setLayout(new BoxLayout(row, BoxLayout.Y_AXIS)); row.setBackground(new Color(240, 244, 252));
        row.setBorder(new CompoundBorder(new MatteBorder(0, 3, 0, 0, color), new EmptyBorder(7, 10, 7, 10)));
        row.add(label(f.name() + " : " + f.type(), 14, true));
        row.add(label(f.modifiers() + " · строка " + f.line(), 10, false));
        if (!f.initializer().isBlank()) { JLabel initial = label("Начальное выражение: " + f.initializer(), 11, false); initial.setToolTipText(f.initializer()); row.add(initial); }
        row.setAlignmentX(Component.LEFT_ALIGNMENT);
        row.setMaximumSize(new Dimension(Integer.MAX_VALUE, row.getPreferredSize().height));
        row.setToolTipText(f.type() + " " + f.name() + " · " + f.modifiers());
        return row;
    }
    private JPanel card(String title, String subtitle) {
        JPanel p = new JPanel(); p.setLayout(new BoxLayout(p, BoxLayout.Y_AXIS)); p.setBackground(Color.WHITE);
        p.setBorder(new CompoundBorder(new LineBorder(new Color(206, 216, 231), 1, true), new EmptyBorder(14, 16, 14, 16)));
        p.setAlignmentX(Component.LEFT_ALIGNMENT);
        p.add(label(title, 20, true)); p.add(label(subtitle, 11, false)); return p;
    }
    private JLabel section(String text) { JLabel l = label(text, 11, true); l.setBorder(new EmptyBorder(16, 0, 8, 0)); return l; }
    private JLabel label(String text, int size, boolean bold) {
        JLabel l = new JLabel(text); l.setAlignmentX(Component.LEFT_ALIGNMENT); l.setForeground(INK); l.setFont(new Font(Font.SANS_SERIF, bold ? Font.BOLD : Font.PLAIN, size)); return l;
    }
}
