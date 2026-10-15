package com.erni.inspector;

import java.nio.file.*;
import java.util.Comparator;

/** Isolated syntax fixtures: does not depend on the game's current class names. */
public class StructureCheck {
    public static void main(String[] args) throws Exception {
        Path root = Files.createTempDirectory("inspector-structure-");
        try {
            Path src = Files.createDirectories(root.resolve("core/src/main/java/demo"));
            Files.writeString(src.resolve("Container.java"), """
                package demo;
                import java.util.List;
                /** A fixture container. */
                class Container {
                    private final List<Item> items = new java.util.ArrayList<>();
                    private Item[] slots;
                    private int count = 3;
                    void open() { new Item(); slots = new Item[2]; Item local = new Item(); }
                    class Nested { Item nestedItem; void make() { new Other(); } }
                }
                class Item {}
                class Other {}
                """);
            var result = SourceIndex.scan(root);
            if (!result.diagnostics().isEmpty()) throw new AssertionError(result.diagnostics());
            var container = result.types().stream().filter(t -> t.name().equals("Container")).findFirst().orElseThrow();
            if (container.members().size() != 3) throw new AssertionError("Nested fields leaked");
            if (!container.members().get(0).type().equals("List<Item>")) throw new AssertionError("Generic lost");
            if (!container.members().get(1).type().equals("Item[]")) throw new AssertionError("Array lost");
            if (!container.members().get(2).scalar()) throw new AssertionError("Scalar misclassified");
            if (container.creations().stream().anyMatch(c -> c.type().equals("Other"))) throw new AssertionError("Nested creation leaked");
            if (container.creations().stream().noneMatch(c -> c.type().equals("Item") && c.method().equals("open()"))) throw new AssertionError("Creation scope missing");
            if (container.creations().stream().noneMatch(c -> c.assignedTo().equals("local"))) throw new AssertionError("Assignment target missing");
            if (SourceIndex.parent(container, "Item", result.types()) == null) throw new AssertionError("Field target missing");
            System.out.println("PASS: object fields, collections, arrays, scalars, creation scope and nested isolation");
        } finally {
            try (var paths = Files.walk(root)) { for (var p : paths.sorted(Comparator.reverseOrder()).toList()) Files.delete(p); }
        }
    }
}
