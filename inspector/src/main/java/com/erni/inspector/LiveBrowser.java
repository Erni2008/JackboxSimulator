package com.erni.inspector;

import javax.swing.*;
import javax.swing.table.*;
import java.awt.*;
import java.awt.event.*;
import java.nio.file.*;
import java.util.*;
import java.util.List;

/** Actual instances under the diagram and a read-only drill-down window. */
final class LiveBrowser extends JPanel implements AutoCloseable {
    private final JLabel state = new JLabel("Запустите ./gradlew :inspector:runLive для живых объектов");
    private final JPanel cards = new JPanel(new FlowLayout(FlowLayout.LEFT));
    private final JDialog detail;
    private final JLabel heading = new JLabel();
    private final JTextField search = new JTextField();
    private final DefaultTableModel model = new DefaultTableModel(new String[]{"Где объявлено", "Поле", "Текущее значение", "Объект"}, 0) { public boolean isCellEditable(int row, int col) { return false; } };
    private final JTable table = new JTable(model);
    private final List<Long> references = new ArrayList<>();
    private final ArrayDeque<Long> history = new ArrayDeque<>();
    private final JButton back = new JButton("← Назад");
    private final Path file;
    private final javax.swing.Timer timer;
    private LiveSnapshot snapshot;
    private String selectedClass;
    private long selectedObject;
    private boolean reading, closed;
    LiveBrowser(JFrame owner, Path file) {
        super(new BorderLayout()); this.file = file;
        setBorder(BorderFactory.createTitledBorder("Реальные экземпляры выбранного класса"));
        add(state, BorderLayout.NORTH); add(new JScrollPane(cards)); setPreferredSize(new Dimension(800, 145));
        detail = new JDialog(owner, "Живой объект · Только чтение", false); detail.setSize(1060, 760); detail.setDefaultCloseOperation(WindowConstants.HIDE_ON_CLOSE);
        JPanel top = new JPanel(new BorderLayout(12, 8)); top.setBorder(BorderFactory.createEmptyBorder(12, 14, 12, 14));
        heading.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 20)); top.add(heading, BorderLayout.NORTH);
        top.add(new JLabel("Поиск поля:"), BorderLayout.WEST); top.add(search); top.add(back, BorderLayout.EAST);
        back.addActionListener(e -> { if (!history.isEmpty()) { selectedObject = history.pop(); refreshDetail(); } });
        table.setRowHeight(36); table.setAutoCreateRowSorter(true); table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.getColumnModel().getColumn(0).setPreferredWidth(180); table.getColumnModel().getColumn(1).setPreferredWidth(390); table.getColumnModel().getColumn(2).setPreferredWidth(240);
        table.addMouseListener(new MouseAdapter() { public void mouseClicked(MouseEvent e) { if (e.getClickCount() == 2) followReference(); } });
        JButton inspect = new JButton("Открыть объект выбранного поля ↗"); inspect.addActionListener(e -> followReference());
        JPanel bottom = new JPanel(new BorderLayout()); bottom.add(new JLabel("Только чтение · Двойной щелчок по полю открывает связанный объект")); bottom.add(inspect, BorderLayout.SOUTH);
        detail.add(top, BorderLayout.NORTH); detail.add(new JScrollPane(table)); detail.add(bottom, BorderLayout.SOUTH);
        search.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
            public void insertUpdate(javax.swing.event.DocumentEvent e) { refreshDetail(); }
            public void removeUpdate(javax.swing.event.DocumentEvent e) { refreshDetail(); }
            public void changedUpdate(javax.swing.event.DocumentEvent e) { refreshDetail(); }
        });
        timer = new javax.swing.Timer(500, e -> poll()); if (file != null) { timer.start(); poll(); }
    }
    boolean isLiveMode() { return file != null; }
    void selectClass(String name) { selectedClass = name; refreshCards(); }
    private void poll() {
        if (reading || closed) return;
        reading = true;
        new SwingWorker<LiveSnapshot, Void>() {
            protected LiveSnapshot doInBackground() throws Exception { return Files.exists(file) ? LiveSnapshot.read(file) : null; }
            protected void done() {
                reading = false; if (closed) return;
                try {
                    snapshot = get(); refreshCards();
                    if (snapshot != null && System.currentTimeMillis() - snapshot.timestamp() < 3000) { if (detail.isVisible()) refreshDetail(); }
                    else if (detail.isVisible()) { heading.setText("Игра остановлена · последние значения недоступны"); model.setRowCount(0); }
                } catch (Exception ex) { state.setText("Не удалось прочитать снимок игры · " + ex.getMessage()); }
            }
        }.execute();
    }
    private void refreshCards() {
        cards.removeAll();
        if (file == null) { cards.revalidate(); cards.repaint(); return; }
        if (snapshot == null || System.currentTimeMillis() - snapshot.timestamp() > 3000) { state.setText("Ожидание игры / игра остановлена"); cards.revalidate(); cards.repaint(); return; }
        var instances = snapshot.nodes().stream().filter(n -> n.type().equals(selectedClass) || n.hierarchy().contains(selectedClass)).toList();
        state.setText(instances.size() + " экземпляров · снимок обновляется каждые 0,5 с" + (snapshot.truncated() ? " · достигнут лимит обхода" : ""));
        for (var node : instances) {
            JButton card = new JButton("◈  " + node + "  · " + node.fields().size() + " полей");
            card.setPreferredSize(new Dimension(300, 52)); card.addActionListener(e -> open(node.id())); cards.add(card);
        }
        if (instances.isEmpty()) cards.add(new JLabel("Объекты класса не найдены среди достижимых объектов текущей игры"));
        cards.revalidate(); cards.repaint();
    }
    private void open(long id) {
        if (selectedObject != 0 && selectedObject != id) history.push(selectedObject);
        selectedObject = id; refreshDetail();
        if (!detail.isVisible()) detail.setLocationRelativeTo(getTopLevelAncestor()); detail.setVisible(true); detail.toFront();
    }
    private void followReference() {
        int row = table.getSelectedRow(); if (row < 0) return;
        long ref = references.get(table.convertRowIndexToModel(row));
        if (ref != 0 && snapshot != null && snapshot.nodes().stream().anyMatch(n -> n.id() == ref)) open(ref);
    }
    private void refreshDetail() {
        if (snapshot == null) return;
        var node = snapshot.nodes().stream().filter(n -> n.id() == selectedObject).findFirst().orElse(null);
        int selected = table.getSelectedRow(); String prior = selected < 0 ? "" : String.valueOf(table.getValueAt(selected, 0)) + "/" + table.getValueAt(selected, 1);
        model.setRowCount(0); references.clear(); back.setEnabled(!history.isEmpty());
        if (node == null) { heading.setText("Объект больше не достижим в текущей игре"); return; }
        heading.setText("Экземпляр " + node + " · живые значения");
        String query = search.getText().strip().toLowerCase(Locale.ROOT);
        Set<Long> available = new HashSet<>(); snapshot.nodes().forEach(n -> available.add(n.id()));
        for (var field : node.fields()) if ((field.owner() + " " + field.signature() + " " + field.value()).toLowerCase(Locale.ROOT).contains(query)) {
            String owner = field.owner().substring(field.owner().lastIndexOf('.') + 1);
            model.addRow(new Object[]{owner, field.signature(), field.value(), field.reference() != 0 && available.contains(field.reference()) ? "↗ открыть" : ""}); references.add(field.reference());
            if ((owner + "/" + field.signature()).equals(prior)) table.setRowSelectionInterval(table.convertRowIndexToView(model.getRowCount() - 1), table.convertRowIndexToView(model.getRowCount() - 1));
        }
    }
    public void close() { closed = true; timer.stop(); detail.dispose(); }
}
