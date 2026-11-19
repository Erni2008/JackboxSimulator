package com.erni.finalanswer.viewer;

import me.friwi.jcefmaven.CefAppBuilder;
import me.friwi.jcefmaven.EnumProgress;
import me.friwi.jcefmaven.MavenCefAppHandlerAdapter;
import org.cef.CefApp;
import org.cef.CefClient;
import org.cef.browser.CefBrowser;

import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

/**
 * In-game view for the web-based 3D mini-games: a borderless full-screen Chromium window (JCEF), no address bar,
 * no tabs. Started by the desktop game as a child process and controlled over stdin:
 * <pre>
 *   load &lt;url&gt;   show another page
 *   close        close the view (the mini-game ended)
 *   (EOF)        the game exited or crashed: close too
 * </pre>
 * Prints "ready" once the page is showing and "closed" on exit, so the game can fall back to the system browser
 * if this process never gets ready. ESC also closes the view (the game itself keeps running).
 * Usage: GameViewer &lt;url&gt; [title]
 */
public final class GameViewer {
    private static volatile CefApp app;
    private static volatile JFrame frame;
    private static volatile boolean closing;

    public static void main(String[] args) throws Exception {
        if (args.length < 1) {System.err.println("usage: GameViewer <url> [title]"); System.exit(2);}
        String url = args[0], title = args.length > 1 ? args[1] : "Final Answer";
        File dir = new File(System.getProperty("finalanswer.viewer.dir", System.getProperty("user.home") + File.separator + ".finalanswer" + File.separator + "jcef"));
        listenToGame();
        // Chromium starts before any AWT window exists (creating Swing first deadlocks CEF start-up on macOS);
        // a small progress window appears only for the one-time download on first launch.
        JFrame progress = null; JLabel status = null;
        if (!new File(dir, "install.lock").isFile()) {
            JLabel[] holder = new JLabel[1]; JFrame[] f = new JFrame[1];
            SwingUtilities.invokeAndWait(() -> {f[0] = new JFrame(title); f[0].setUndecorated(true); holder[0] = new JLabel("Preparing the game view…", SwingConstants.CENTER);
                holder[0].setForeground(new Color(0xCF, 0xB9, 0x98)); holder[0].setFont(holder[0].getFont().deriveFont(Font.PLAIN, 20f));
                f[0].getContentPane().setBackground(Color.BLACK); f[0].add(holder[0]); f[0].setSize(520, 140); f[0].setLocationRelativeTo(null); f[0].setVisible(true);});
            progress = f[0]; status = holder[0];
        }
        CefAppBuilder builder = new CefAppBuilder();
        builder.setInstallDir(dir);
        JLabel st = status;
        builder.setProgressHandler((state, percent) -> {if (st != null) SwingUtilities.invokeLater(() -> st.setText(progressText(state, percent)));});
        builder.getCefSettings().windowless_rendering_enabled = false;
        builder.getCefSettings().log_severity = org.cef.CefSettings.LogSeverity.LOGSEVERITY_DISABLE;
        // the host's voice and the race music start without a click; no first-run prompts
        builder.addJcefArgs("--autoplay-policy=no-user-gesture-required", "--disable-features=Translate", "--no-first-run", "--hide-scrollbars");
        builder.setAppHandler(new MavenCefAppHandlerAdapter() {
            @Override public void stateHasChanged(CefApp.CefAppState state) {if (state == CefApp.CefAppState.TERMINATED) System.exit(0);}
        });
        app = builder.build();
        CefClient client = app.createClient();
        browser = client.createBrowser(url, false, false);
        JFrame p = progress;
        SwingUtilities.invokeLater(() -> {
            if (p != null) p.dispose();
            buildFrame(title);
            frame.getContentPane().add(browser.getUIComponent(), BorderLayout.CENTER);
            frame.setVisible(true);
            fullScreen();
            browser.getUIComponent().requestFocusInWindow();
            System.out.println("ready"); System.out.flush();
        });
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {System.out.println("closed"); System.out.flush();}));
    }

    /** True full screen: no menu bar or Dock on macOS, no taskbar on Windows. */
    private static void fullScreen() {
        GraphicsDevice device = GraphicsEnvironment.getLocalGraphicsEnvironment().getDefaultScreenDevice();
        if (device.isFullScreenSupported()) device.setFullScreenWindow(frame);
        else frame.setBounds(device.getDefaultConfiguration().getBounds());
        frame.toFront();
    }

    private static volatile CefBrowser browser;

    private static void buildFrame(String title) {
        frame = new JFrame(title);
        frame.setUndecorated(true);
        frame.setBackground(Color.BLACK);
        frame.getContentPane().setBackground(Color.BLACK);
        frame.getContentPane().setLayout(new BorderLayout());
        // cover the whole display the game runs on (borderless full screen, like the game window)
        Rectangle screen = GraphicsEnvironment.getLocalGraphicsEnvironment().getDefaultScreenDevice().getDefaultConfiguration().getBounds();
        frame.setBounds(screen);
        frame.setDefaultCloseOperation(WindowConstants.DO_NOTHING_ON_CLOSE);
        frame.addWindowListener(new WindowAdapter() {@Override public void windowClosing(WindowEvent e) {close();}});
        frame.getRootPane().registerKeyboardAction(e -> close(), KeyStroke.getKeyStroke(KeyEvent.VK_ESCAPE, 0), JComponent.WHEN_IN_FOCUSED_WINDOW);
        KeyboardFocusManager.getCurrentKeyboardFocusManager().addKeyEventDispatcher(e -> {
            if (e.getID() == KeyEvent.KEY_PRESSED && e.getKeyCode() == KeyEvent.VK_ESCAPE) {close(); return true;}
            return false;
        });
    }

    private static String progressText(EnumProgress state, float percent) {
        return switch (state) {
            case LOCATING -> "Preparing the game view…";
            case DOWNLOADING -> percent >= 0 ? String.format("Downloading the game view… %d%%", (int) percent) : "Downloading the game view…";
            case EXTRACTING -> "Unpacking the game view…";
            case INSTALL -> "Installing the game view…";
            case INITIALIZING -> "Starting…";
            case INITIALIZED -> "";
        };
    }

    /** Commands from the desktop game; EOF means the game is gone, so the view must not outlive it. */
    private static void listenToGame() {
        Thread t = new Thread(() -> {
            try (BufferedReader in = new BufferedReader(new InputStreamReader(System.in, StandardCharsets.UTF_8))) {
                for (String line; (line = in.readLine()) != null; ) {
                    line = line.strip();
                    if (line.equals("close")) {close(); return;}
                    if (line.startsWith("load ") && browser != null) {String u = line.substring(5).strip(); SwingUtilities.invokeLater(() -> browser.loadURL(u));}
                    if (line.equals("front") && frame != null) SwingUtilities.invokeLater(() -> {frame.setVisible(true); frame.toFront();});
                }
            } catch (Exception ignored) {}
            close();
        }, "game-commands");
        t.setDaemon(true);
        t.start();
    }

    private static void close() {
        if (closing) return;
        closing = true;
        SwingUtilities.invokeLater(() -> {
            if (frame != null) {GraphicsDevice d = frame.getGraphicsConfiguration().getDevice(); if (d.getFullScreenWindow() == frame) d.setFullScreenWindow(null); frame.setVisible(false);}
            if (app != null) app.dispose(); else System.exit(0); // TERMINATED -> exit
            // safety net: never hang around if Chromium does not shut down cleanly
            Thread killer = new Thread(() -> {try {Thread.sleep(3000);} catch (InterruptedException ignored) {} Runtime.getRuntime().halt(0);});
            killer.setDaemon(true); killer.start();
        });
    }
}
