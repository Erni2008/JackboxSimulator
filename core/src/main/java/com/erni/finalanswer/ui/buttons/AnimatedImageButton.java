package com.erni.finalanswer.ui.buttons;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.math.Interpolation;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.ui.Button;
import com.badlogic.gdx.scenes.scene2d.utils.ChangeListener;
import com.badlogic.gdx.utils.Disposable;

/** Общая отрисовка трёх PNG; каждая кнопка задаёт свои картинки и действие. */
public abstract class AnimatedImageButton extends Button implements Disposable {
    private final Texture[] textures = new Texture[3];
    private ShaderProgram transitionShader;
    private float hoverAmount;
    private float pressAmount;
    private float entranceTime;
    private boolean disposed;

    // Стандартные вершины SpriteBatch: положение, цвет и координаты изображения.
    private static final String VERTEX_SHADER = """
        attribute vec4 a_position;
        attribute vec4 a_color;
        attribute vec2 a_texCoord0;
        uniform mat4 u_projTrans;
        varying vec4 v_color;
        varying vec2 v_texCoords;
        void main() {
            v_color = a_color;
            v_color.a *= 255.0 / 254.0;
            v_texCoords = a_texCoord0;
            gl_Position = u_projTrans * a_position;
        }
        """;

    // Смешиваем состояния с учётом прозрачности: края не темнеют при переходе.
    private static final String FRAGMENT_SHADER = """
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec4 v_color;
        varying vec2 v_texCoords;
        uniform sampler2D u_texture;
        uniform sampler2D u_overTexture;
        uniform sampler2D u_downTexture;
        uniform float u_hover;
        uniform float u_press;
        vec4 premultiply(vec4 c) { return vec4(c.rgb * c.a, c.a); }
        void main() {
            vec4 up = premultiply(texture2D(u_texture, v_texCoords));
            vec4 over = premultiply(texture2D(u_overTexture, v_texCoords));
            vec4 down = premultiply(texture2D(u_downTexture, v_texCoords));
            vec4 base = mix(up, over, u_hover);
            // Каждое состояние использует свой PNG полностью.
            // Переход остаётся плавным, но наведение и нажатие хорошо различимы.
            vec4 result = mix(base, down, u_press);
            vec3 rgb = result.rgb / max(result.a, 0.00001);
            // Цвет и свечение уже нарисованы в PNG: сохраняем авторский дизайн.
            gl_FragColor = vec4(rgb, result.a) * v_color;
        }
        """;

    protected AnimatedImageButton(String directory, String up, String hover, String pressed) {
        // Button обрабатывает мышь. Его стандартное оформление не используем.
        super(new ButtonStyle());
        String[] files = {up, hover, pressed};
        try {
            // Загружаем три настоящих изображения один раз при создании.
            for (int i = 0; i < files.length; i++) {
                textures[i] = new Texture(Gdx.files.internal(directory + files[i]));
                textures[i].setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
            }
            // Нормализованные координаты допускают небольшую разницу размеров PNG.
            transitionShader = new ShaderProgram(VERTEX_SHADER, FRAGMENT_SHADER);
            if (!transitionShader.isCompiled()) {
                throw new IllegalStateException("Ошибка переходов кнопки: " + transitionShader.getLog());
            }
        } catch (RuntimeException error) {
            dispose();
            throw error;
        }
        setSize(660, 660 * getImageAspectRatio());
        addListener(new ChangeListener() {
            @Override
            public void changed(ChangeEvent event, Actor actor) {
                onActivate();
            }
        });
    }

    // MainMenu использует эти пропорции, чтобы не растягивать кнопку.
    public float getImageAspectRatio() {
        return (float) textures[0].getHeight() / textures[0].getWidth();
    }

    @Override
    public Actor hit(float x, float y, boolean touchable) {
        // Прозрачные поля соседних PNG перекрываются только при рисовании.
        // Область ввода ограничена рамкой и не перехватывает соседнюю кнопку.
        if (x < getWidth() * 0.02f || x >= getWidth() * 0.98f
            || y < getHeight() * 0.18f || y >= getHeight() * 0.82f) {
            return null;
        }
        return super.hit(x, y, touchable);
    }

    public void restartEntrance() {
        entranceTime = 0;
        hoverAmount = 0;
        pressAmount = 0;
    }

    @Override
    public void act(float delta) {
        super.act(delta);
        float frameDelta = MathUtils.clamp(delta, 0, 0.1f);
        entranceTime += frameDelta;
        float hoverTarget = !isDisabled() && isOver() ? 1 : 0;
        float pressTarget = !isDisabled() && isPressed() ? 1 : 0;
        // Наведение примерно 180 мс; возврат чуть медленнее.
        hoverAmount = approach(hoverAmount, hoverTarget, frameDelta,
            hoverTarget > hoverAmount ? 0.06f : 0.075f);
        // Быстрый, но мягкий отклик без резкой смены изображения.
        pressAmount = approach(pressAmount, pressTarget, frameDelta,
            pressTarget > pressAmount ? 0.04f : 0.06f);
    }

    private float approach(float current, float target, float delta, float response) {
        // Экспоненциальное сглаживание сохраняет скорость при разном FPS.
        float factor = 1 - (float) Math.exp(-delta / response);
        float result = MathUtils.lerp(current, target, factor);
        return Math.abs(result - target) < 0.001f ? target : result;
    }

    @Override
    public void draw(Batch batch, float parentAlpha) {
        if (disposed) return;
        // Появление начинается чуть позже логотипа и длится 450 мс.
        float entrance = Interpolation.smooth.apply(
            MathUtils.clamp((entranceTime - 0.12f) / 0.45f, 0, 1));
        // Надпись встроена в PNG и всегда движется вместе с рамкой.
        // Небольшая амплитуда сохраняет спокойное движение всего элемента.
        float scale = 1 + hoverAmount * 0.012f - pressAmount * 0.006f;
        float x = getX();
        float y = getY();
        float opacity = parentAlpha * getColor().a * entrance;
        if (isDisabled()) opacity *= 0.45f;
        if (opacity <= 0) return;
        // Batch общий для сцены, поэтому его настройки обязательно возвращаем.
        Color previous = batch.getColor();
        float r = previous.r, g = previous.g, b = previous.b, a = previous.a;
        ShaderProgram previousShader = batch.getShader();
        try {
            batch.flush();
            textures[1].bind(1);
            textures[2].bind(2);
            Gdx.gl.glActiveTexture(GL20.GL_TEXTURE0);
            batch.setShader(transitionShader);
            transitionShader.setUniformi("u_overTexture", 1);
            transitionShader.setUniformi("u_downTexture", 2);
            transitionShader.setUniformf("u_hover", hoverAmount);
            transitionShader.setUniformf("u_press", pressAmount);
            Color tint = getColor();
            batch.setColor(tint.r, tint.g, tint.b, opacity);
            // Центр преобразования совпадает с центром надписи.
            batch.draw(textures[0], x, y, getWidth() / 2, getHeight() / 2,
                getWidth(), getHeight(), scale, scale, 0,
                0, 0, textures[0].getWidth(), textures[0].getHeight(), false, false);
            batch.flush();
            batch.setShader(previousShader);
        } finally {
            batch.setShader(previousShader);
            batch.setColor(r, g, b, a);
            Gdx.gl.glActiveTexture(GL20.GL_TEXTURE0);
        }
    }

    // Конкретная кнопка определяет действие; анимация остаётся общей.
    protected abstract void onActivate();

    @Override
    public void dispose() {
        // Stage не освобождает картинки кнопки. Повторный вызов безопасен.
        if (disposed) return;
        disposed = true;
        for (Texture texture : textures) {
            if (texture != null) texture.dispose();
        }
        if (transitionShader != null) transitionShader.dispose();
    }
}
