package com.erni.inspector;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;
import java.util.*;
import java.util.List;
import java.util.function.Consumer;

/** Deterministic layered inheritance graph with selectable nodes. */
final class Diagram extends JPanel {
    private final Map<String, Rectangle> boxes = new LinkedHashMap<>();
    private final Map<String, SourceIndex.Type> project = new HashMap<>();
    private final List<String[]> edges = new ArrayList<>();
    private double scale = 1;
    String selected;
    private int width, height;
    Diagram(Consumer<SourceIndex.Type> selection) {
        setBackground(new Color(245, 247, 251));
        addMouseListener(new MouseAdapter() {
            public void mouseClicked(MouseEvent e) {
                Point p = new Point((int)(e.getX() / scale), (int)(e.getY() / scale));
                boxes.forEach((id, box) -> { if (box.contains(p) && project.containsKey(id)) selection.accept(project.get(id)); });
            }
        });
        setToolTipText("Выберите класс, чтобы увидеть его описание, поля и методы");
    }
    void setTypes(List<SourceIndex.Type> visible, List<SourceIndex.Type> all) {
        boxes.clear(); project.clear(); edges.clear();
        Map<String, Set<String>> parents = new LinkedHashMap<>();
        for (var t : visible) { project.put(t.qualified(), t); parents.put(t.qualified(), new LinkedHashSet<>()); }
        for (var t : visible) for (String p : t.parents()) {
            var resolved = SourceIndex.parent(t, p, all);
            String id = resolved == null ? p : resolved.qualified();
            if (resolved != null) project.put(id, resolved);
            parents.putIfAbsent(id, new LinkedHashSet<>());
            parents.get(t.qualified()).add(id);
            // The extends clause is first for ordinary classes; interface parents are dashed.
            boolean inheritance = p.equals(t.superclass());
            edges.add(new String[]{t.qualified(), id, inheritance ? "class" : "interface"});
        }
        // Keep unrelated hierarchies in separate columns to avoid crossing trees.
        Set<String> remaining = new LinkedHashSet<>(parents.keySet());
        int offset = 36;
        width = 760; height = 200;
        while (!remaining.isEmpty()) {
            Set<String> component = new LinkedHashSet<>();
            ArrayDeque<String> queue = new ArrayDeque<>(); queue.add(remaining.iterator().next());
            while (!queue.isEmpty()) {
                String id = queue.remove(); if (!component.add(id)) continue;
                queue.addAll(parents.getOrDefault(id, Set.of()));
                parents.forEach((child, ps) -> { if (ps.contains(id)) queue.add(child); });
            }
            remaining.removeAll(component);
            Map<Integer, List<String>> levels = new TreeMap<>();
            for (String id : component) levels.computeIfAbsent(depth(id, parents, new HashSet<>()), k -> new ArrayList<>()).add(id);
            int columns = levels.values().stream().mapToInt(List::size).max().orElse(1);
            for (var level : levels.entrySet()) {
                level.getValue().sort(String::compareTo);
                int col = 0, centered = (columns - level.getValue().size()) * 129;
                for (String id : level.getValue()) boxes.put(id, new Rectangle(offset + centered + col++ * 258, 48 + level.getKey() * 156, 228, 80));
                height = Math.max(height, 180 + level.getKey() * 156);
            }
            offset += columns * 258 + 32;
        }
        width = Math.max(width, offset);
        resizeCanvas();
    }
    private int depth(String id, Map<String, Set<String>> parents, Set<String> path) {
        if (!path.add(id)) return 0;
        int d = 0;
        for (String parent : parents.getOrDefault(id, Set.of())) d = Math.max(d, 1 + depth(parent, parents, new HashSet<>(path)));
        return d;
    }
    void zoom(String action) {
        if (action.equals("Вписать")) {
            var viewport = (JViewport) SwingUtilities.getAncestorOfClass(JViewport.class, this);
            if (viewport != null) scale = Math.max(.2, Math.min(1, Math.min((double) viewport.getWidth() / width, (double) viewport.getHeight() / height)));
            resizeCanvas(); return;
        }
        scale = action.equals("100%") ? 1 : Math.clamp(scale * (action.equals("+") ? 1.2 : 1 / 1.2), .4, 2.5);
        resizeCanvas();
    }
    private void resizeCanvas() { setPreferredSize(new Dimension((int)(width * scale), (int)(height * scale))); revalidate(); repaint(); }
    protected void paintComponent(Graphics graphics) {
        super.paintComponent(graphics);
        Graphics2D g = (Graphics2D) graphics.create();
        g.scale(scale, scale); g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        if (boxes.isEmpty()) { g.setColor(Color.GRAY); g.drawString("Классы не найдены. Измените поиск или обновите исходники.", 36, 60); }
        for (var edge : edges) {
            Rectangle child = boxes.get(edge[0]), parent = boxes.get(edge[1]);
            int x1 = child.x + child.width / 2, y1 = child.y, x2 = parent.x + parent.width / 2, y2 = parent.y + parent.height;
            g.setColor(new Color(137, 149, 171));
            g.setStroke(edge[2].equals("interface") ? new BasicStroke(1.5f, 0, 0, 1, new float[]{6, 5}, 0) : new BasicStroke(1.5f));
            int middle = (y1 + y2) / 2;
            g.draw(new Line2D.Double(x1, y1, x1, middle)); g.drawLine(x1, middle, x2, middle); g.drawLine(x2, middle, x2, y2 + 10);
            g.setStroke(new BasicStroke(1.5f));
            Polygon arrow = new Polygon(new int[]{x2, x2 - 6, x2 + 6}, new int[]{y2, y2 + 10, y2 + 10}, 3);
            g.setColor(getBackground()); g.fill(arrow); g.setColor(new Color(137, 149, 171)); g.draw(arrow);
        }
        for (var entry : boxes.entrySet()) {
            String id = entry.getKey(); Rectangle r = entry.getValue(); var t = project.get(id);
            boolean active = id.equals(selected);
            g.setColor(t == null ? new Color(232, 235, 241) : Color.WHITE); g.fillRoundRect(r.x, r.y, r.width, r.height, 16, 16);
            g.setColor(active ? new Color(74, 103, 227) : new Color(203, 212, 228)); g.setStroke(new BasicStroke(active ? 2.5f : 1)); g.drawRoundRect(r.x, r.y, r.width, r.height, 16, 16);
            g.setFont(new Font(Font.SANS_SERIF, Font.PLAIN, 11)); g.setColor(new Color(112, 126, 151));
            g.drawString(t == null ? "LIBRARY" : t.kind().strip().toUpperCase(Locale.ROOT), r.x + 14, r.y + 20);
            g.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 15)); g.setColor(new Color(35, 47, 72));
            g.drawString(shorten(g, t == null ? SourceIndex.simple(id) : t.name(), 200), r.x + 14, r.y + 44);
            g.setFont(new Font(Font.SANS_SERIF, Font.PLAIN, 10)); g.setColor(new Color(112, 126, 151));
            g.drawString(shorten(g, t == null ? id : t.pkg(), 200), r.x + 14, r.y + 64);
        }
        g.dispose();
    }
    private String shorten(Graphics2D g, String s, int max) {
        if (g.getFontMetrics().stringWidth(s) <= max) return s;
        while (!s.isEmpty() && g.getFontMetrics().stringWidth(s + "…") > max) s = s.substring(0, s.length() - 1);
        return s + "…";
    }
}
