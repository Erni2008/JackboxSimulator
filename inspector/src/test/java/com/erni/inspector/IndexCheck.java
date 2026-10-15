package com.erni.inspector;
import java.nio.file.*;
public class IndexCheck {
 public static void main(String[] args) throws Exception {
  var result = SourceIndex.scan(Path.of(args[0]));
  if (!result.diagnostics().isEmpty()) throw new AssertionError(result.diagnostics());
  var play = result.types().stream().filter(t -> t.name().equals("PlayButton")).findFirst().orElseThrow();
  if (!play.superclass().equals("AnimatedImageButton")) throw new AssertionError(play);
  if (SourceIndex.parent(play, play.superclass(), result.types()) == null) throw new AssertionError("Parent missing");
  if (play.methods().stream().noneMatch(m -> m.contains("onActivate"))) throw new AssertionError("Method missing");
  if (play.line() < 1 || play.doc().isEmpty()) throw new AssertionError("Source metadata missing");
  System.out.println("PASS: " + result.types().size() + " types; inheritance, methods, documentation and source positions.");
 }
}
