import os
import numpy as np
from PIL import Image

def render_mandelbrot(width, height, center_x, center_y, span_x, max_iter, palette_fn):
    span_y = span_x * (height / width)
    x = np.linspace(center_x - span_x / 2, center_x + span_x / 2, width)
    y = np.linspace(center_y - span_y / 2, center_y + span_y / 2, height)
    C = x[np.newaxis, :] + 1j * y[:, np.newaxis]
    
    Z = np.zeros_like(C)
    iterations = np.zeros(C.shape, dtype=np.float64)
    mask = np.ones(C.shape, dtype=bool)
    
    for i in range(max_iter):
        Z[mask] = Z[mask] * Z[mask] + C[mask]
        escaped = np.abs(Z) > 4.0
        newly_escaped = escaped & mask
        if np.any(newly_escaped):
            # Smooth shading calculation: i + 1 - log(log(|Z|))/log(2)
            z_abs = np.abs(Z[newly_escaped])
            smooth_val = i + 1.0 - np.log2(np.maximum(1e-9, np.log(np.maximum(1e-9, z_abs))))
            iterations[newly_escaped] = smooth_val
            mask[escaped] = False
        if not np.any(mask):
            break
            
    iterations[mask] = 0.0
    return palette_fn(iterations, mask, max_iter)

def palette_cosmic(iters, mask, max_iter):
    t = iters * 0.035
    r = np.clip((np.sin(t) * 0.5 + 0.5) * 255, 0, 255)
    g = np.clip((np.sin(t + 2.0) * 0.4 + 0.4) * 255, 0, 255)
    b = np.clip((np.sin(t + 4.0) * 0.5 + 0.5) * 255, 0, 255)
    r[mask] = 8
    g[mask] = 10
    b[mask] = 18
    rgb = np.stack([r, g, b], axis=-1).astype(np.uint8)
    return rgb

def palette_fire(iters, mask, max_iter):
    t = iters * 0.05
    r = np.clip((np.sin(t) * 0.5 + 0.5) * 255, 0, 255)
    g = np.clip((np.sin(t + 1.2) * 0.35 + 0.35) * 200, 0, 255)
    b = np.clip((np.sin(t + 2.4) * 0.2 + 0.2) * 100, 0, 255)
    r[mask] = 12
    g[mask] = 4
    b[mask] = 4
    return np.stack([r, g, b], axis=-1).astype(np.uint8)

def palette_emerald(iters, mask, max_iter):
    t = iters * 0.04
    r = np.clip((np.sin(t + 1.5) * 0.2 + 0.2) * 120, 0, 255)
    g = np.clip((np.sin(t) * 0.5 + 0.5) * 255, 0, 255)
    b = np.clip((np.sin(t + 0.8) * 0.4 + 0.4) * 220, 0, 255)
    r[mask] = 4
    g[mask] = 14
    b[mask] = 10
    return np.stack([r, g, b], axis=-1).astype(np.uint8)

def palette_electric(iters, mask, max_iter):
    t = iters * 0.06
    r = np.clip((np.sin(t + 4.2) * 0.5 + 0.5) * 220, 0, 255)
    g = np.clip((np.sin(t + 2.1) * 0.4 + 0.4) * 200, 0, 255)
    b = np.clip((np.sin(t) * 0.5 + 0.5) * 255, 0, 255)
    r[mask] = 5
    g[mask] = 5
    b[mask] = 15
    return np.stack([r, g, b], axis=-1).astype(np.uint8)

def palette_golden(iters, mask, max_iter):
    t = iters * 0.03
    r = np.clip((np.sin(t) * 0.5 + 0.5) * 255, 0, 255)
    g = np.clip((np.sin(t + 0.4) * 0.45 + 0.45) * 220, 0, 255)
    b = np.clip((np.sin(t + 2.0) * 0.2 + 0.2) * 80, 0, 255)
    r[mask] = 15
    g[mask] = 12
    b[mask] = 5
    return np.stack([r, g, b], axis=-1).astype(np.uint8)

samples = [
    {
        "id": "mandelbrot_01_seahorse",
        "cx": -0.74364388703715870475,
        "cy": 0.13182590420531197049,
        "span": 0.005,
        "iter": 600,
        "pal": palette_cosmic
    },
    {
        "id": "mandelbrot_02_fire_spiral",
        "cx": -0.7495,
        "cy": 0.0985,
        "span": 0.004,
        "iter": 700,
        "pal": palette_fire
    },
    {
        "id": "mandelbrot_03_emerald_scepter",
        "cx": -0.1011,
        "cy": 0.9563,
        "span": 0.008,
        "iter": 800,
        "pal": palette_emerald
    },
    {
        "id": "mandelbrot_04_deep_minibrot",
        "cx": -1.76877883,
        "cy": -0.00173899,
        "span": 0.0015,
        "iter": 900,
        "pal": palette_electric
    },
    {
        "id": "mandelbrot_05_golden_valley",
        "cx": 0.275,
        "cy": 0.006,
        "span": 0.02,
        "iter": 650,
        "pal": palette_golden
    }
]

out_full = "/Volumes/PortableSSD/RUST/RUST-HTML/SITO1/images/full"
out_thumb = "/Volumes/PortableSSD/RUST/RUST-HTML/SITO1/images/thumbnails"

for s in samples:
    print(f"Rendering {s['id']}...")
    rgb = render_mandelbrot(1920, 1080, s['cx'], s['cy'], s['span'], s['iter'], s['pal'])
    img = Image.fromarray(rgb)
    full_path = os.path.join(out_full, f"{s['id']}.jpg")
    img.save(full_path, "JPEG", quality=92)
    
    thumb = img.resize((640, 360), Image.Resampling.LANCZOS)
    thumb_path = os.path.join(out_thumb, f"{s['id']}_thumb.jpg")
    thumb.save(thumb_path, "JPEG", quality=88)

print("All sample images generated successfully!")
