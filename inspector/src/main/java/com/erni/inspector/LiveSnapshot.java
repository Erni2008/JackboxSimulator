package com.erni.inspector;

import java.io.*;
import java.nio.file.*;
import java.util.*;

/** Explicit, read-only snapshot protocol; no serialized Java objects or executable commands. */
record LiveSnapshot(long timestamp, boolean truncated, List<Node> nodes) {
    record Field(String owner, String signature, String value, long reference) {}
    record Node(long id, String type, List<String> hierarchy, List<Field> fields) {
        @Override public String toString() { return type.substring(type.lastIndexOf('.') + 1) + " #" + id; }
    }
    void write(Path path) throws IOException {
        Path temp = path.resolveSibling(path.getFileName() + ".tmp");
        try (var out = new DataOutputStream(new BufferedOutputStream(Files.newOutputStream(temp)))) {
            out.writeInt(0x46414931); out.writeLong(timestamp); out.writeBoolean(truncated); out.writeInt(nodes.size());
            for (var node : nodes) {
                out.writeLong(node.id); out.writeUTF(node.type); out.writeInt(node.hierarchy.size());
                for (String parent : node.hierarchy) out.writeUTF(parent);
                out.writeInt(node.fields.size());
                for (var f : node.fields) { out.writeUTF(f.owner); out.writeUTF(f.signature); out.writeUTF(f.value); out.writeLong(f.reference); }
            }
        }
        try { Files.move(temp, path, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING); }
        catch (AtomicMoveNotSupportedException ex) { Files.move(temp, path, StandardCopyOption.REPLACE_EXISTING); }
    }
    static LiveSnapshot read(Path path) throws IOException {
        try (var in = new DataInputStream(new BufferedInputStream(Files.newInputStream(path)))) {
            if (in.readInt() != 0x46414931) throw new IOException("Unknown snapshot format");
            long timestamp = in.readLong(); boolean truncated = in.readBoolean();
            int size = bounded(in.readInt(), 1000); List<Node> nodes = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                long id = in.readLong(); String type = in.readUTF();
                int parents = bounded(in.readInt(), 100); List<String> hierarchy = new ArrayList<>();
                for (int p = 0; p < parents; p++) hierarchy.add(in.readUTF());
                int count = bounded(in.readInt(), 1000); List<Field> fields = new ArrayList<>();
                for (int f = 0; f < count; f++) fields.add(new Field(in.readUTF(), in.readUTF(), in.readUTF(), in.readLong()));
                nodes.add(new Node(id, type, List.copyOf(hierarchy), List.copyOf(fields)));
            }
            return new LiveSnapshot(timestamp, truncated, List.copyOf(nodes));
        }
    }
    private static int bounded(int value, int max) throws IOException { if (value < 0 || value > max) throw new IOException("Invalid snapshot size"); return value; }
}
