package com.erni.inspector;

import java.lang.ref.*;
import java.lang.reflect.*;
import java.util.*;

/** Called only on the game thread. Reads fields without invoking user methods. */
final class LiveCollector {
    private static final class Key extends WeakReference<Object> {
        final int hash;
        Key(Object object, ReferenceQueue<Object> queue) { super(object, queue); hash = System.identityHashCode(object); }
        public int hashCode() { return hash; }
        public boolean equals(Object other) { return this == other || other instanceof Key k && get() != null && get() == k.get(); }
    }
    private final ReferenceQueue<Object> queue = new ReferenceQueue<>();
    private final Map<Key, Long> ids = new HashMap<>();
    private long nextId;
    private long id(Object object) {
        Reference<?> stale; while ((stale = queue.poll()) != null) ids.remove(stale);
        Key key = new Key(object, queue); return ids.computeIfAbsent(key, k -> ++nextId);
    }
    LiveSnapshot capture(Object root) {
        record Entry(Object object, int depth) {}
        ArrayDeque<Entry> pending = new ArrayDeque<>(); pending.add(new Entry(root, 0));
        Set<Object> visited = Collections.newSetFromMap(new IdentityHashMap<>());
        List<LiveSnapshot.Node> nodes = new ArrayList<>(); boolean truncated = false;
        while (!pending.isEmpty() && nodes.size() < 600) {
            var entry = pending.remove(); Object object = entry.object();
            if (!visited.add(object)) continue;
            long objectId = id(object); Class<?> type = object.getClass();
            List<String> hierarchy = new ArrayList<>(); List<LiveSnapshot.Field> fields = new ArrayList<>();
            if (object instanceof Collection<?> collection && type.getName().startsWith("java.util.")) {
                hierarchy.add(type.getName()); int i = 0;
                fields.add(new LiveSnapshot.Field(type.getName(), "size", Integer.toString(collection.size()), 0));
                for (Object value : collection) {
                    if (i == 100) { truncated = true; break; }
                    long ref = scalar(value) ? 0 : id(value);
                    fields.add(new LiveSnapshot.Field(type.getName(), "[" + i++ + "]", describe(value), ref));
                    if (ref != 0 && entry.depth() < 10 && traversable(value)) pending.add(new Entry(value, entry.depth() + 1));
                }
            } else if (object instanceof Map<?, ?> map && type.getName().startsWith("java.util.")) {
                hierarchy.add(type.getName()); int i = 0;
                fields.add(new LiveSnapshot.Field(type.getName(), "size", Integer.toString(map.size()), 0));
                for (var pair : map.entrySet()) {
                    if (i == 100) { truncated = true; break; }
                    Object value = pair.getValue(); long ref = scalar(value) ? 0 : id(value);
                    fields.add(new LiveSnapshot.Field(type.getName(), "[" + i++ + "] key=" + describe(pair.getKey()), describe(value), ref));
                    if (ref != 0 && entry.depth() < 10 && traversable(value)) pending.add(new Entry(value, entry.depth() + 1));
                }
            } else if (type.isArray()) {
                int length = Array.getLength(object);
                fields.add(new LiveSnapshot.Field(type.getName(), "length", Integer.toString(length), 0));
                for (int i = 0; i < Math.min(length, 100); i++) {
                    Object value = Array.get(object, i); long ref = scalar(value) ? 0 : id(value);
                    fields.add(new LiveSnapshot.Field(type.getName(), "[" + i + "]", describe(value), ref));
                    if (ref != 0 && entry.depth() < 10) pending.add(new Entry(value, entry.depth() + 1));
                }
                if (length > 100) truncated = true;
            } else {
                for (Class<?> owner = type; owner != null && owner != Object.class; owner = owner.getSuperclass()) {
                    hierarchy.add(owner.getName());
                    if (owner.getName().startsWith("com.erni.inspector.LiveLauncher$")) continue;
                    if (!owner.getName().startsWith("com.erni.") && !owner.getName().startsWith("com.badlogic.gdx.")) continue;
                    for (var field : owner.getDeclaredFields()) {
                        if (field.isSynthetic()) continue;
                        String signature = Modifier.toString(field.getModifiers()) + " " + field.getType().getSimpleName() + " " + field.getName();
                        try {
                            if (!field.trySetAccessible()) { fields.add(new LiveSnapshot.Field(owner.getName(), signature, "Недоступно", 0)); continue; }
                            Object value = field.get(Modifier.isStatic(field.getModifiers()) ? null : object);
                            long ref = scalar(value) ? 0 : id(value);
                            fields.add(new LiveSnapshot.Field(owner.getName(), signature, describe(value), ref));
                            if (ref != 0 && !Modifier.isStatic(field.getModifiers()) && entry.depth() < 10 && traversable(value)) pending.add(new Entry(value, entry.depth() + 1));
                            else if (ref != 0 && entry.depth() >= 10) truncated = true;
                        } catch (RuntimeException | IllegalAccessException ex) { fields.add(new LiveSnapshot.Field(owner.getName(), signature, "Недоступно", 0)); }
                    }
                }
            }
            nodes.add(new LiveSnapshot.Node(objectId, type.getName(), List.copyOf(hierarchy), List.copyOf(fields)));
        }
        return new LiveSnapshot(System.currentTimeMillis(), truncated || !pending.isEmpty(), List.copyOf(nodes));
    }
    private boolean traversable(Object value) { String name = value.getClass().getName(); return value.getClass().isArray() || name.startsWith("java.util.") && (value instanceof Collection<?> || value instanceof Map<?, ?>) || name.startsWith("com.erni.") || name.startsWith("com.badlogic.gdx."); }
    private boolean scalar(Object value) { return value == null || value instanceof String || value instanceof Number && value.getClass().getName().startsWith("java.lang.") || value instanceof Boolean || value instanceof Character || value instanceof Enum<?>; }
    private String describe(Object value) {
        if (value == null) return "null";
        if (value instanceof Enum<?> e) return e.name();
        if (scalar(value)) { String text = String.valueOf(value); return text.length() > 2000 ? text.substring(0, 2000) + "…" : text; }
        return value.getClass().getSimpleName() + " #" + id(value);
    }
}
