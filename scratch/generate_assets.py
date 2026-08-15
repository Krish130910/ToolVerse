import os
from PIL import Image

input_path = r"C:\Users\krish\.gemini\antigravity\brain\0bdb6847-cd1a-4073-adea-7cc65cc43a35\.user_uploaded\media_1786810111456.png"
public_dir = r"c:\Users\krish\OneDrive\Desktop\PROJECTS\2026\ToolVerse\public"

img = Image.open(input_path).convert('L')
w, h = img.size

# High-resolution output scale factor (4x)
scale = 4
out_w = w * scale
out_h = h * scale

# 1. Generate High-Res Pure White Pixel Hands Transparent PNG
out_img = Image.new('RGBA', (out_w, out_h), (0, 0, 0, 0))
out_pixels = out_img.load()

# Upscale source image with bicubic interpolation
img_upscaled = img.resize((out_w, out_h), Image.Resampling.LANCZOS)
up_pixels = img_upscaled.load()

for y in range(out_h):
    for x in range(out_w):
        val = up_pixels[x, y]
        if val > 45:
            norm = (val - 45) / (255.0 - 45)
            alpha = int(min(255, val * 1.2))
            
            # Pure white/silver pixel palette
            if norm > 0.7:
                r, g, b = 255, 255, 255 # Pure white dot center
            elif norm > 0.35:
                r, g, b = 228, 228, 231 # Bright silver zinc-200
            else:
                r, g, b = 161, 161, 170 # Edge silver zinc-400
                
            out_pixels[x, y] = (r, g, b, alpha)

out_white_path = os.path.join(public_dir, 'pixel-hands-white-hd.png')
out_img.save(out_white_path)
print(f'Generated {out_white_path} ({out_w}x{out_h})')

# 2. Generate Left Hand and Right Hand separately for side framing
split_x = int(w * 0.48)
left_crop = img.crop((0, 0, split_x, h))
right_crop = img.crop((split_x, 0, w, h))

def process_crop(crop_img, filename):
    cw, ch = crop_img.size
    cow, coh = cw * scale, ch * scale
    c_upscale = crop_img.resize((cow, coh), Image.Resampling.LANCZOS)
    c_pixels = c_upscale.load()
    out = Image.new('RGBA', (cow, coh), (0, 0, 0, 0))
    op = out.load()
    for y in range(coh):
        for x in range(cow):
            val = c_pixels[x, y]
            if val > 45:
                norm = (val - 45) / (255.0 - 45)
                alpha = int(min(255, val * 1.2))
                if norm > 0.7:
                    r, g, b = 255, 255, 255
                elif norm > 0.35:
                    r, g, b = 228, 228, 231
                else:
                    r, g, b = 161, 161, 170
                op[x, y] = (r, g, b, alpha)
    save_path = os.path.join(public_dir, filename)
    out.save(save_path)
    print(f'Generated {save_path}')

process_crop(left_crop, 'pixel-hand-left-white.png')
process_crop(right_crop, 'pixel-hand-right-white.png')

# 3. Generate Crisp Vector SVG with pure white/silver colors
pitch = 3 # grid sampling pitch
svg_dots = []
for y in range(0, h, pitch):
    for x in range(0, w, pitch):
        max_val = 0
        for dy in range(pitch):
            for dx in range(pitch):
                if x+dx < w and y+dy < h:
                    max_val = max(max_val, img.getpixel((x+dx, y+dy)))
        if max_val > 50:
            norm = (max_val - 50) / (255.0 - 50)
            if norm > 0.7:
                color = "#ffffff"
                size = 2.4
            elif norm > 0.35:
                color = "#e4e4e7"
                size = 2.0
            else:
                color = "#a1a1aa"
                size = 1.6
            opacity = round(min(1.0, norm * 1.1), 2)
            svg_dots.append((x, y, color, opacity, size))

svg_path = os.path.join(public_dir, 'pixel-hands-white.svg')
with open(svg_path, 'w', encoding='utf-8') as f:
    f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="100%" height="100%">\n')
    f.write('  <defs>\n')
    f.write('    <filter id="whiteGlow" x="-20%" y="-20%" width="140%" height="140%">\n')
    f.write('      <feGaussianBlur stdDeviation="1.2" result="blur" />\n')
    f.write('      <feComposite in="SourceGraphic" in2="blur" operator="over" />\n')
    f.write('    </filter>\n')
    f.write('  </defs>\n')
    f.write('  <g filter="url(#whiteGlow)">\n')
    for x, y, color, opacity, size in svg_dots:
        f.write(f'    <rect x="{x}" y="{y}" width="{size}" height="{size}" rx="0.4" fill="{color}" opacity="{opacity}" />\n')
    f.write('  </g>\n')
    f.write('</svg>\n')

print(f'Generated clean {svg_path} with {len(svg_dots)} white hand dot elements')
