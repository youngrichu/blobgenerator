let originalPath = '';
        let originalPoints = [];
        let currentVariation = '';
        let variationCounter = 0;
        let collectedVariations = [];
        let shapeCenter = { x: 0, y: 0 };
        let averageRadius = 100;
        let globalColor = '#54aa95';
        let globalColorSecondary = '#764ba2';
        
        // Theme management
        function initializeTheme() {
            const savedTheme = localStorage.getItem('blob-generator-theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeToggle(savedTheme);
        }
        
        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('blob-generator-theme', newTheme);
            updateThemeToggle(newTheme);
        }
        
        function updateThemeToggle(theme) {
            const themeIcon = document.getElementById('themeIcon');
            const themeText = document.getElementById('themeText');
            
            if (theme === 'dark') {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Light';
            } else {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Dark';
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            initializeTheme();
            setupEventListeners();
            updateControlDisplays();
            updatePatternDisplays();
            updateSpeedDisplay();
            togglePatternSelector();
            initializeAccordions();
        });
        
        // Initialize accordion states - animation panel open by default
        function initializeAccordions() {
            // Close color settings by default
            const colorHeader = document.querySelector('[onclick="toggleAccordion(\'colors\')"');
            const colorContent = document.getElementById('colors-content');
            colorHeader.classList.remove('active');
            colorContent.classList.remove('active');
            
            // Close flow parameters by default
            const flowHeader = document.querySelector('[onclick="toggleAccordion(\'flow\')"');
            const flowContent = document.getElementById('flow-content');
            flowHeader.classList.remove('active');
            flowContent.classList.remove('active');
            
            // Open animation settings by default
            const animationHeader = document.querySelector('[onclick="toggleAccordion(\'animation\')"');
            const animationContent = document.getElementById('animation-content');
            animationHeader.classList.add('active');
            animationContent.classList.add('active');
        }
        
        // Accordion functionality
        function toggleAccordion(section) {
            const header = document.querySelector(`#${section}-content`).previousElementSibling;
            const content = document.getElementById(`${section}-content`);
            
            header.classList.toggle('active');
            content.classList.toggle('active');
        }
        
        function setupEventListeners() {
            const uploadArea = document.getElementById('uploadArea');
            const fileInput = document.getElementById('fileInput');
            
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', handleDragOver);
            uploadArea.addEventListener('drop', handleDrop);
            uploadArea.addEventListener('dragleave', handleDragLeave);
            fileInput.addEventListener('change', handleFileSelect);
            
            document.getElementById('flowIntensity').addEventListener('input', updateControlDisplays);
            document.getElementById('flowSmoothness').addEventListener('input', updateControlDisplays);
            
            // Color controls
            document.getElementById('colorPicker').addEventListener('change', (e) => updateGlobalColor(e.target.value));
            document.getElementById('colorInput').addEventListener('change', updateGlobalColorFromInput);
            document.getElementById('colorFormat').addEventListener('change', updateColorInputFormat);
            
            // Pattern controls
            document.getElementById('patternDensity').addEventListener('input', updatePatternDisplays);
            document.getElementById('patternOpacity').addEventListener('input', updatePatternDisplays);
            document.getElementById('includePattern').addEventListener('change', togglePatternSelector);
            document.getElementById('animationSpeed').addEventListener('input', updateSpeedDisplay);
        }
        
        function updatePatternDisplays() {
            const density = document.getElementById('patternDensity').value;
            const opacity = document.getElementById('patternOpacity').value;
            
            document.getElementById('densityValue').textContent = density;
            document.getElementById('opacityValue').textContent = opacity;
        }
        
        function updateSpeedDisplay() {
            const speed = parseFloat(document.getElementById('animationSpeed').value);
            const baseDuration = 4.0; // Shorter duration works better with 3 frames
            const actualDuration = (baseDuration / speed).toFixed(1);
            
            document.getElementById('speedValue').textContent = `${speed}x ${speed === 1.0 ? 'Normal' : speed < 1.0 ? 'Slower' : 'Faster'} Speed`;
            document.getElementById('durationDisplay').textContent = `${actualDuration}s`;
        }
        
        function togglePatternSelector() {
            const patternSelector = document.getElementById('patternSelector');
            const includePattern = document.getElementById('includePattern').checked;
            patternSelector.style.display = includePattern ? 'block' : 'none';
        }
        
        // Pattern Generator Class
        class PatternGenerator {
            static generatePattern(type, bounds, density, opacity) {
                const { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = bounds;
                
                switch (type) {
                    case 'stars':
                        return this.generateStars(bounds, density, opacity);
                    case 'dots':
                        return this.generateDots(bounds, density, opacity);
                    case 'chevron':
                        return this.generateChevron(bounds, density, opacity);
                    case 'stripes':
                        return this.generateStripes(bounds, density, opacity);
                    case 'hexagon':
                        return this.generateHexagon(bounds, density, opacity);
                    case 'checkerboard':
                        return this.generateCheckerboard(bounds, density, opacity);
                    case 'circles':
                        return this.generateCircles(bounds, density, opacity);
                    case 'waves':
                        return this.generateWaves(bounds, density, opacity);
                    case 'grid':
                        return this.generateGrid(bounds, density, opacity);
                    case 'triangles':
                        return this.generateTriangles(bounds, density, opacity);
                    default:
                        return this.generateStars(bounds, density, opacity);
                }
            }
            
            static generateStars(bounds, density, opacity) {
                const { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = bounds;
                const baseCount = 9; // Match the clean example
                const numStars = Math.floor(baseCount * density);
                const starElements = [];
                
                // Calculate center and spread for better distribution within shape
                const centerX = viewBoxX + viewBoxWidth / 2;
                const centerY = viewBoxY + viewBoxHeight / 2;
                const maxRadius = Math.min(viewBoxWidth, viewBoxHeight) * 0.35; // 70% of shape area
                
                for (let i = 0; i < numStars; i++) {
                    // Use polar distribution centered on shape for better coverage
                    const angle = (Math.random() * 2 * Math.PI);
                    const radius = Math.random() * maxRadius;
                    const x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * viewBoxWidth * 0.3;
                    const y = centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * viewBoxHeight * 0.3;
                    
                    // Ensure stars stay within bounds
                    const clampedX = Math.max(viewBoxX + 20, Math.min(viewBoxX + viewBoxWidth - 20, x));
                    const clampedY = Math.max(viewBoxY + 20, Math.min(viewBoxY + viewBoxHeight - 20, y));
                    
                    const starRadius = (0.7 + Math.random() * 0.8) * density; // 0.7-1.5 range like the example
                    const shouldTwinkle = i % 2 === 0; // About 50% twinkle (every other one)
                    
                    starElements.push(`
        <circle class="star${shouldTwinkle ? ' twinkle' : ''}" cx="${clampedX.toFixed(0)}" cy="${clampedY.toFixed(0)}" r="${starRadius.toFixed(1)}" opacity="${opacity}"/>`);
                }
                
                return starElements.join('');
            }
            
            static generateDots(bounds, density, opacity) {
                const { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = bounds;
                const spacing = 20 / density;
                const dotElements = [];
                
                for (let x = viewBoxX; x < viewBoxX + viewBoxWidth; x += spacing) {
                    for (let y = viewBoxY; y < viewBoxY + viewBoxHeight; y += spacing) {
                        const offsetX = x + (Math.random() - 0.5) * spacing * 0.3;
                        const offsetY = y + (Math.random() - 0.5) * spacing * 0.3;
                        const radius = (2 + Math.random() * 3) * density;
                        
                        dotElements.push(`
        <circle cx="${offsetX.toFixed(1)}" cy="${offsetY.toFixed(1)}" r="${radius.toFixed(1)}" opacity="${opacity}"/>`);
                    }
                }
                
                return dotElements.join('');
            }
            
            static generateChevron(bounds, density, opacity) {
                const { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = bounds;
                const spacing = 25 / density;
                const chevronElements = [];
                
                for (let y = viewBoxY; y < viewBoxY + viewBoxHeight + spacing; y += spacing) {
                    const pathData = `M${viewBoxX},${y} L${viewBoxX + spacing/2},${y + spacing/2} L${viewBoxX + spacing},${y} L${viewBoxX + spacing*1.5},${y + spacing/2} L${viewBoxX + spacing*2},${y}`;
                    
                    for (let x = viewBoxX; x < viewBoxX + viewBoxWidth; x += spacing * 2) {
                        const translatedPath = pathData.replace(/(\d+\.?\d*)/g, (match) => {
                            return (parseFloat(match) + x - viewBoxX).toFixed(1);
                        });
                        
                        chevronElements.push(`
        <path d="${translatedPath}" stroke="rgba(255,255,255,${opacity})" stroke-width="${1 * density}" fill="none"/>`);
                    }
                }
                
                return chevronElements.join('');
            }
            
            static generateStripes(bounds, density, opacity) {
                const { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = bounds;
                const spacing = 15 / density;
                const stripeElements = [];
                
                for (let i = 0; i < viewBoxWidth / spacing; i++) {
                    const x1 = viewBoxX + i * spacing;
                    const y1 = viewBoxY;
                    const x2 = viewBoxX + i * spacing + viewBoxHeight;
                    const y2 = viewBoxY + viewBoxHeight;
                    
                    stripeElements.push(`
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,${opacity})" stroke-width="${2 * density}"/>`);
                }
                
                return stripeElements.join('');
            }
            
            static generateHexagon(bounds, density, opacity) {
                const { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = bounds;
                const size = 12 / density;
                const hexElements = [];
                
                const hexHeight = size * Math.sqrt(3);
                const hexWidth = size * 2;
                
                for (let row = 0; row * hexHeight < viewBoxHeight + hexHeight; row++) {
                    for (let col = 0; col * hexWidth * 0.75 < viewBoxWidth + hexWidth; col++) {
                        const x = viewBoxX + col * hexWidth * 0.75;
                        const y = viewBoxY + row * hexHeight + (col % 2) * hexHeight * 0.5;
                        
                        const points = [];
                        for (let i = 0; i < 6; i++) {
                            const angle = (i * Math.PI) / 3;
                            const px = x + size * Math.cos(angle);
                            const py = y + size * Math.sin(angle);
                            points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
                        }
                        
                        hexElements.push(`
        <polygon points="${points.join(' ')}" stroke="rgba(255,255,255,${opacity})" stroke-width="${1 * density}" fill="none"/>`);
                    }
                }
                
                return hexElements.join('');
            }
            
            static generateCheckerboard(bounds, density, opacity) {
                const { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = bounds;
                const size = 20 / density;
                const checkerElements = [];
                
                for (let x = viewBoxX; x < viewBoxX + viewBoxWidth; x += size) {
                    for (let y = viewBoxY; y < viewBoxY + viewBoxHeight; y += size) {
                        const col = Math.floor((x - viewBoxX) / size);
                        const row = Math.floor((y - viewBoxY) / size);
                        
                        if ((col + row) % 2 === 0) {
                            checkerElements.push(`
        <rect x="${x}" y="${y}" width="${size}" height="${size}" fill="rgba(255,255,255,${opacity})"/>`);
                        }
                    }
                }
                
                return checkerElements.join('');
            }
            
            static generateCircles(bounds, density, opacity) {
                const { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = bounds;
                const numCircles = Math.floor(8 * density);
                const circleElements = [];
                
                for (let i = 0; i < numCircles; i++) {
                    const x = viewBoxX + Math.random() * viewBoxWidth;
                    const y = viewBoxY + Math.random() * viewBoxHeight;
                    const radius = (5 + Math.random() * 15) * density;
                    const animationDelay = Math.random() * 3;
                    
                    circleElements.push(`
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(1)}" 
                stroke="rgba(255,255,255,${opacity})" stroke-width="${1 * density}" fill="none"
                opacity="${opacity}">
            <animate attributeName="r" values="${radius};${radius * 1.5};${radius}" 
                     dur="4s" repeatCount="indefinite" begin="${animationDelay}s"/>
        </circle>`);
                }
                
                return circleElements.join('');
            }
            static generateWaves(bounds, density, opacity) {
                const { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = bounds;
                const spacing = 20 / density;
                const waveElements = [];
                
                for (let y = viewBoxY; y < viewBoxY + viewBoxHeight; y += spacing) {
                    let pathData = `M${viewBoxX},${y}`;
                    for (let x = viewBoxX; x <= viewBoxX + viewBoxWidth; x += 10) {
                        const waveY = y + Math.sin((x - viewBoxX) * 0.02 * density) * 5 * density;
                        pathData += ` L${x},${waveY}`;
                    }
                    
                    waveElements.push(`
        <path d="${pathData}" stroke="rgba(255,255,255,${opacity})" stroke-width="${1.5 * density}" fill="none"/>`);
                }
                
                return waveElements.join('');
            }
            
            static generateGrid(bounds, density, opacity) {
                const { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = bounds;
                const spacing = 25 / density;
                const gridElements = [];
                
                // Vertical lines
                for (let x = viewBoxX; x <= viewBoxX + viewBoxWidth; x += spacing) {
                    gridElements.push(`
        <line x1="${x}" y1="${viewBoxY}" x2="${x}" y2="${viewBoxY + viewBoxHeight}" 
              stroke="rgba(255,255,255,${opacity})" stroke-width="${1 * density}"/>`);
                }
                
                // Horizontal lines
                for (let y = viewBoxY; y <= viewBoxY + viewBoxHeight; y += spacing) {
                    gridElements.push(`
        <line x1="${viewBoxX}" y1="${y}" x2="${viewBoxX + viewBoxWidth}" y2="${y}" 
              stroke="rgba(255,255,255,${opacity})" stroke-width="${1 * density}"/>`);
                }
                
                return gridElements.join('');
            }
            
            static generateTriangles(bounds, density, opacity) {
                const { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = bounds;
                const size = 15 / density;
                const triangleElements = [];
                
                for (let x = viewBoxX; x < viewBoxX + viewBoxWidth; x += size * 1.5) {
                    for (let y = viewBoxY; y < viewBoxY + viewBoxHeight; y += size * Math.sqrt(3) * 0.5) {
                        const offsetX = ((y - viewBoxY) / (size * Math.sqrt(3) * 0.5)) % 2 === 0 ? 0 : size * 0.75;
                        const centerX = x + offsetX;
                        const centerY = y;
                        
                        const x1 = centerX;
                        const y1 = centerY - size * 0.577;
                        const x2 = centerX - size * 0.5;
                        const y2 = centerY + size * 0.289;
                        const x3 = centerX + size * 0.5;
                        const y3 = centerY + size * 0.289;
                        
                        triangleElements.push(`
        <polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" 
                 stroke="rgba(255,255,255,${opacity})" stroke-width="${1 * density}" fill="none"/>`);
                    }
                }
                
                return triangleElements.join('');
            }
        }
        
        function updateGlobalColor(color) {
            globalColor = color;
            globalColorSecondary = adjustBrightness(color, -20);
            updateColorInput(color);
            document.getElementById('currentColorDisplay').textContent = color;
            
            // Update current variation display if exists
            if (currentVariation) {
                showVariation();
            }
        }

        function updateGlobalColorFromInput() {
            const input = document.getElementById('colorInput').value.trim();
            const format = document.getElementById('colorFormat').value;
            
            try {
                let hexColor;
                if (format === 'hex') {
                    hexColor = input.startsWith('#') ? input : '#' + input;
                } else if (format === 'rgb') {
                    const matches = input.match(/(\d+),?\s*(\d+),?\s*(\d+)/);
                    if (matches) {
                        const r = parseInt(matches[1]);
                        const g = parseInt(matches[2]);
                        const b = parseInt(matches[3]);
                        hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                    }
                } else if (format === 'hsl') {
                    const matches = input.match(/(\d+),?\s*(\d+)%?,?\s*(\d+)%?/);
                    if (matches) {
                        const h = parseInt(matches[1]) / 360;
                        const s = parseInt(matches[2]) / 100;
                        const l = parseInt(matches[3]) / 100;
                        const rgb = hslToRgb(h, s, l);
                        hexColor = `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`;
                    }
                }
                
                if (hexColor && /^#[0-9A-F]{6}$/i.test(hexColor)) {
                    updateGlobalColor(hexColor);
                    document.getElementById('colorPicker').value = hexColor;
                } else {
                    showError('Invalid color format');
                }
            } catch (error) {
                showError('Invalid color format');
            }
        }

        function updateColorInputFormat() {
            updateColorInput(globalColor);
        }

        function updateColorInput(hexColor) {
            const format = document.getElementById('colorFormat').value;
            const input = document.getElementById('colorInput');
            
            if (format === 'hex') {
                input.value = hexColor;
            } else if (format === 'rgb') {
                const r = parseInt(hexColor.slice(1, 3), 16);
                const g = parseInt(hexColor.slice(3, 5), 16);
                const b = parseInt(hexColor.slice(5, 7), 16);
                input.value = `${r}, ${g}, ${b}`;
            } else if (format === 'hsl') {
                const r = parseInt(hexColor.slice(1, 3), 16) / 255;
                const g = parseInt(hexColor.slice(3, 5), 16) / 255;
                const b = parseInt(hexColor.slice(5, 7), 16) / 255;
                const hsl = rgbToHsl(r, g, b);
                input.value = `${Math.round(hsl[0] * 360)}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%`;
            }
        }

        function randomizeColor() {
            const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#f5576c', '#764ba2', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c', '#f1c40f', '#e67e22', '#2ecc71', '#3498db'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            updateGlobalColor(randomColor);
            document.getElementById('colorPicker').value = randomColor;
        }

        function adjustBrightness(hex, percent) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            
            const newR = Math.max(0, Math.min(255, r + (r * percent / 100)));
            const newG = Math.max(0, Math.min(255, g + (g * percent / 100)));
            const newB = Math.max(0, Math.min(255, b + (b * percent / 100)));
            
            return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
        }

        function hslToRgb(h, s, l) {
            let r, g, b;
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        function rgbToHsl(r, g, b) {
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [h, s, l];
        }

        function extractAndSetColors(svgDoc) {
            let detectedColor = null;
            
            const paths = svgDoc.querySelectorAll('path');
            for (let path of paths) {
                const fill = path.getAttribute('fill');
                if (fill && fill !== 'none' && fill !== 'transparent' && !fill.includes('url(')) {
                    detectedColor = fill;
                    break;
                }
            }
            
            if (!detectedColor) {
                for (let path of paths) {
                    const stroke = path.getAttribute('stroke');
                    if (stroke && stroke !== 'none' && stroke !== 'transparent') {
                        detectedColor = stroke;
                        break;
                    }
                }
            }
            
            if (detectedColor) {
                globalColor = normalizeColor(detectedColor);
                globalColorSecondary = adjustBrightness(globalColor, -20);
                document.getElementById('colorPicker').value = globalColor;
                updateColorInput(globalColor);
                document.getElementById('currentColorDisplay').textContent = globalColor;
                showSuccess(`Color auto-detected: ${globalColor}`);
            }
        }

        function normalizeColor(color) {
            if (color.startsWith('#')) return color;
            
            if (color.startsWith('rgb')) {
                const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (matches) {
                    const r = parseInt(matches[1]);
                    const g = parseInt(matches[2]);
                    const b = parseInt(matches[3]);
                    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                }
            }
            
            const colorMap = {
                red: '#ff0000', blue: '#0000ff', green: '#008000', yellow: '#ffff00',
                orange: '#ffa500', purple: '#800080', pink: '#ffc0cb', brown: '#a52a2a',
                black: '#000000', white: '#ffffff', gray: '#808080', grey: '#808080'
            };
            
            return colorMap[color.toLowerCase()] || '#667eea';
        }

        function updateControlDisplays() {
            const intensity = document.getElementById('flowIntensity').value;
            const smoothness = document.getElementById('flowSmoothness').value;
            
            document.getElementById('flowIntensityValue').textContent = `${(intensity * 100).toFixed(0)}%`;
            document.getElementById('flowSmoothnessValue').textContent = `${(smoothness * 100).toFixed(0)}%`;
        }
        
        function handleDragOver(e) {
            e.preventDefault();
            document.getElementById('uploadArea').classList.add('dragover');
        }
        
        function handleDragLeave(e) {
            e.preventDefault();
            document.getElementById('uploadArea').classList.remove('dragover');
        }
        
        function handleDrop(e) {
            e.preventDefault();
            document.getElementById('uploadArea').classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) processFile(files[0]);
        }
        
        function handleFileSelect(e) {
            const files = Array.from(e.target.files);
            if (files.length > 0) processFile(files[0]);
        }
        
        function processFile(file) {
            if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    analyzeSVG(e.target.result);
                };
                reader.readAsText(file);
            } else {
                showError('Please upload a valid SVG file');
            }
        }
        
        function analyzeSVG(svgContent) {
            try {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
                const paths = svgDoc.querySelectorAll('path');
                
                if (paths.length === 0) {
                    showError('No paths found in SVG');
                    return;
                }
                
                originalPath = paths[0].getAttribute('d');
                originalPoints = pathToPoints(originalPath);
                
                if (originalPoints.length < 3) {
                    showError('Path too simple - need more points');
                    return;
                }
                
                analyzeShape();
                extractAndSetColors(svgDoc);
                showOriginalPreview(svgContent);
                enableControls();
                
                showSuccess(`Loaded! Found ${originalPoints.length} points. Ready to make smooth flow variations!`);
            } catch (error) {
                showError(`Error: ${error.message}`);
        }
        }
        
        function pathToPoints(pathString) {
            const points = [];
            const commands = pathString.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || [];
            
            let currentX = 0, currentY = 0;
            
            commands.forEach(command => {
                const cmd = command[0];
                const coords = command.slice(1).trim();
                const numbers = coords ? coords.match(/[+-]?([0-9]*[.])?[0-9]+/g)?.map(n => parseFloat(n)) || [] : [];
                
                switch (cmd.toLowerCase()) {
                    case 'm':
                        if (numbers.length >= 2) {
                            currentX = cmd === 'M' ? numbers[0] : currentX + numbers[0];
                            currentY = cmd === 'M' ? numbers[1] : currentY + numbers[1];
                            points.push({ x: currentX, y: currentY });
                        }
                        break;
                    case 'l':
                        for (let i = 0; i < numbers.length; i += 2) {
                            if (i + 1 < numbers.length) {
                                currentX = cmd === 'L' ? numbers[i] : currentX + numbers[i];
                                currentY = cmd === 'L' ? numbers[i + 1] : currentY + numbers[i + 1];
                                points.push({ x: currentX, y: currentY });
                            }
                        }
                        break;
                    case 'c':
                        for (let i = 0; i < numbers.length; i += 6) {
                            if (i + 5 < numbers.length) {
                                // Sample curve points
                                for (let t = 0.25; t <= 1; t += 0.25) {
                                    const cp1x = cmd === 'C' ? numbers[i] : currentX + numbers[i];
                                    const cp1y = cmd === 'C' ? numbers[i + 1] : currentY + numbers[i + 1];
                                    const cp2x = cmd === 'C' ? numbers[i + 2] : currentX + numbers[i + 2];
                                    const cp2y = cmd === 'C' ? numbers[i + 3] : currentY + numbers[i + 3];
                                    const endX = cmd === 'C' ? numbers[i + 4] : currentX + numbers[i + 4];
                                    const endY = cmd === 'C' ? numbers[i + 5] : currentY + numbers[i + 5];
                                    
                                    const x = Math.pow(1-t, 3) * currentX + 
                                             3 * Math.pow(1-t, 2) * t * cp1x + 
                                             3 * (1-t) * Math.pow(t, 2) * cp2x + 
                                             Math.pow(t, 3) * endX;
                                    const y = Math.pow(1-t, 3) * currentY + 
                                             3 * Math.pow(1-t, 2) * t * cp1y + 
                                             3 * (1-t) * Math.pow(t, 2) * cp2y + 
                                             Math.pow(t, 3) * endY;
                                    points.push({ x, y });
                                }
                                currentX = cmd === 'C' ? numbers[i + 4] : currentX + numbers[i + 4];
                                currentY = cmd === 'C' ? numbers[i + 5] : currentY + numbers[i + 5];
                            }
                        }
                        break;
                }
            });
            
            // Keep point count reasonable for smooth paths
            while (points.length < 16) {
                const newPoints = [];
                for (let i = 0; i < points.length; i++) {
                    newPoints.push(points[i]);
                    const next = points[(i + 1) % points.length];
                    newPoints.push({
                        x: (points[i].x + next.x) / 2,
                        y: (points[i].y + next.y) / 2
                    });
                }
                points.splice(0, points.length, ...newPoints);
            }
            
            // Don't let it get too complex
            if (points.length > 32) {
                const simplified = simplifyPoints(points, 24);
                points.splice(0, points.length, ...simplified);
            }
            
            return points;
        }
        
        function analyzeShape() {
            // Calculate center
            const centerX = originalPoints.reduce((sum, p) => sum + p.x, 0) / originalPoints.length;
            const centerY = originalPoints.reduce((sum, p) => sum + p.y, 0) / originalPoints.length;
            shapeCenter = { x: centerX, y: centerY };
            
            // Calculate average radius
            const distances = originalPoints.map(p => 
                Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
            );
            averageRadius = distances.reduce((sum, d) => sum + d, 0) / distances.length;
        }
        
        function generateVariation() {
            if (originalPoints.length === 0) return;
            
            variationCounter++;
            const flowStyle = document.getElementById('flowStyle').value;
            const intensity = parseFloat(document.getElementById('flowIntensity').value);
            const smoothness = parseFloat(document.getElementById('flowSmoothness').value);
            
            let deformedPoints = applyFlowDeformation(originalPoints, flowStyle, intensity, smoothness, variationCounter);
            
            // More conservative smoothing to preserve original shape character
            const smoothingPasses = Math.floor(smoothness * 2) + 1; // 1-3 passes instead of 3-6
            deformedPoints = smoothPoints(deformedPoints, smoothingPasses);
            
            currentVariation = pointsToCleanPath(deformedPoints);
            showVariation();
            
            document.getElementById('downloadBtn').disabled = false;
            document.getElementById('collectBtn').disabled = false;
            
            showSuccess(`Generated ${flowStyle} variation #${variationCounter} that preserves original shape!`);
        }
        
        // NEW: Generate smooth flow sequence for water-like animations
        function generateFlowSequence() {
            if (!originalPoints.length) return;
            
            collectedVariations = [];
            const flowStyle = document.getElementById('flowStyle').value;
            const intensity = parseFloat(document.getElementById('flowIntensity').value);
            const smoothness = parseFloat(document.getElementById('flowSmoothness').value);
            
            // Generate a unique sequence seed each time for different variations
            const sequenceSeed = Math.random() * 1000 + Date.now() * 0.001;
            
            // Generate exactly 3 simple variations for clean animation
            const numFrames = 3;
            for (let i = 0; i < numFrames; i++) {
                variationCounter++;
                
                let deformedPoints = applySimpleFlowDeformation(
                    originalPoints, 
                    flowStyle, 
                    intensity, 
                    i,
                    numFrames,
                    sequenceSeed  // Pass the sequence seed for consistent but unique variations
                );
                
                // Minimal smoothing to keep shapes simple but smooth
                deformedPoints = smoothPoints(deformedPoints, 2);
                
                const variation = pointsToCleanPath(deformedPoints);
                collectedVariations.push(variation);
            }
            
            // Show the last variation as preview
            currentVariation = collectedVariations[collectedVariations.length - 1];
            showVariation();
            updateCollectionStatus();
            
            document.getElementById('downloadBtn').disabled = false;
            document.getElementById('collectBtn').disabled = false;
            document.getElementById('animateBtn').disabled = false;
            
            showSuccess(`Generated unique flow sequence! ${numFrames} new variations ready for smooth animation.`);
        }
        
        // Simple deformation for clean, fraternal shapes
        function applySimpleFlowDeformation(points, flowStyle, intensity, frameIndex, totalFrames, sequenceSeed) {
            return points.map((point, index) => {
                const angle = Math.atan2(point.y - shapeCenter.y, point.x - shapeCenter.x);
                const radius = Math.sqrt((point.x - shapeCenter.x) ** 2 + (point.y - shapeCenter.y) ** 2);
                
                // Keep deformation subtle for fraternal similarity
                let deformation = 0;
                const maxDeformation = intensity * 0.15; // Much more conservative (15% instead of 35%)
                
                // Add randomness based on sequence seed while maintaining flow coherence
                const seedOffset = sequenceSeed * 0.1;
                const randomPhase1 = Math.sin(sequenceSeed * 12.9898) * 43758.5453;
                const randomPhase2 = Math.sin(sequenceSeed * 78.233) * 43758.5453;
                const phase1 = (randomPhase1 - Math.floor(randomPhase1)) * Math.PI * 2;
                const phase2 = (randomPhase2 - Math.floor(randomPhase2)) * Math.PI * 2;
                
                // Vary the wave frequencies slightly based on flow style and seed
                let freq1, freq2, freq3, freq4;
                switch (flowStyle) {
                    case 'gentle':
                        freq1 = 3 + Math.sin(sequenceSeed * 1.1) * 0.5;
                        freq2 = 7 + Math.sin(sequenceSeed * 1.7) * 0.8;
                        freq3 = 4 + Math.sin(sequenceSeed * 2.3) * 0.6;
                        freq4 = 5 + Math.sin(sequenceSeed * 3.1) * 0.7;
                        break;
                    case 'dynamic':
                        freq1 = 4 + Math.sin(sequenceSeed * 1.3) * 1.0;
                        freq2 = 6 + Math.sin(sequenceSeed * 1.9) * 1.2;
                        freq3 = 5 + Math.sin(sequenceSeed * 2.7) * 0.8;
                        freq4 = 7 + Math.sin(sequenceSeed * 3.5) * 1.0;
                        break;
                    case 'rhythmic':
                        freq1 = 2 + Math.sin(sequenceSeed * 0.9) * 0.3;
                        freq2 = 8 + Math.sin(sequenceSeed * 1.5) * 1.0;
                        freq3 = 3 + Math.sin(sequenceSeed * 2.1) * 0.4;
                        freq4 = 6 + Math.sin(sequenceSeed * 2.9) * 0.8;
                        break;
                    case 'chaotic':
                        freq1 = 5 + Math.sin(sequenceSeed * 1.7) * 1.5;
                        freq2 = 3.7 + Math.sin(sequenceSeed * 2.3) * 1.2;
                        freq3 = 7.3 + Math.sin(sequenceSeed * 3.1) * 1.8;
                        freq4 = 4.2 + Math.sin(sequenceSeed * 3.7) * 1.4;
                        break;
                    default:
                        freq1 = 3; freq2 = 7; freq3 = 4; freq4 = 5;
                }
                
                // Generate smooth flowing variations with randomized parameters
                switch (frameIndex) {
                    case 0: // First frame
                        deformation = Math.sin(angle * freq1 + phase1) * maxDeformation * 0.5 +
                                     Math.sin(angle * freq2 + phase2) * maxDeformation * 0.3;
                        break;
                    case 1: // Middle frame
                        deformation = Math.sin(angle * freq3 + phase1 + Math.PI/3) * maxDeformation * 0.6 +
                                     Math.cos(angle * freq4 + phase2) * maxDeformation * 0.4;
                        break;
                    case 2: // Final frame
                        deformation = Math.sin(angle * (freq1 + freq3) * 0.5 + phase1 + Math.PI/6) * maxDeformation * 0.5 +
                                     Math.sin(angle * (freq2 + freq4) * 0.5 + phase2 + Math.PI/2) * maxDeformation * 0.3;
                        break;
                }
                
                const newRadius = radius * (1 + deformation);
                
                return {
                    x: shapeCenter.x + newRadius * Math.cos(angle),
                    y: shapeCenter.y + newRadius * Math.sin(angle)
                };
            });
        }
        
        // Generate clean, smooth paths with proper curves
        function pointsToCleanPath(points) {
            if (points.length === 0) return '';
            
            // Keep enough points for smoothness but not excessive
            const targetPoints = Math.min(Math.max(points.length, 16), 24);
            const workingPoints = points.length > targetPoints ? simplifyPoints(points, targetPoints) : points;
            
            // Start the path
            let path = `M${workingPoints[0].x.toFixed(1)},${workingPoints[0].y.toFixed(1)}`;
            
            // Create smooth curves with proper control points
            for (let i = 0; i < workingPoints.length; i++) {
                const current = workingPoints[i];
                const next = workingPoints[(i + 1) % workingPoints.length];
                const prev = workingPoints[(i - 1 + workingPoints.length) % workingPoints.length];
                const nextNext = workingPoints[(i + 2) % workingPoints.length];
                
                // Calculate smooth tangent vectors
                const prevToNext = {
                    x: next.x - prev.x,
                    y: next.y - prev.y
                };
                
                const currentToNextNext = {
                    x: nextNext.x - current.x,
                    y: nextNext.y - current.y
                };
                
                // Normalize and scale for smooth curves
                const prevToNextLen = Math.sqrt(prevToNext.x ** 2 + prevToNext.y ** 2) || 1;
                const currentToNextNextLen = Math.sqrt(currentToNextNext.x ** 2 + currentToNextNext.y ** 2) || 1;
                
                const controlDistance = Math.min(
                    Math.sqrt((next.x - current.x) ** 2 + (next.y - current.y) ** 2) * 0.3,
                    25
                );
                
                // Smooth control points
                const cp1x = current.x + (prevToNext.x / prevToNextLen) * controlDistance;
                const cp1y = current.y + (prevToNext.y / prevToNextLen) * controlDistance;
                const cp2x = next.x - (currentToNextNext.x / currentToNextNextLen) * controlDistance;
                const cp2y = next.y - (currentToNextNext.y / currentToNextNextLen) * controlDistance;
                
                path += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${next.x.toFixed(1)},${next.y.toFixed(1)}`;
            }
            
            path += ' Z';
            return path;
        }
        
        // Better point simplification that preserves curves
        function simplifyPoints(points, targetCount) {
            if (points.length <= targetCount) return points;
            
            // Use Douglas-Peucker-inspired simplification
            const step = points.length / targetCount;
            const simplified = [];
            
            for (let i = 0; i < targetCount; i++) {
                const index = Math.round(i * step) % points.length;
                simplified.push(points[index]);
            }
            
            return simplified;
        }
        
        function applyFlowDeformation(points, flowStyle, intensity, smoothness, seed) {
            return points.map((point, index) => {
                const angle = Math.atan2(point.y - shapeCenter.y, point.x - shapeCenter.x);
                const radius = Math.sqrt((point.x - shapeCenter.x) ** 2 + (point.y - shapeCenter.y) ** 2);
                
                let deformation = 0;
                const maxDeformation = intensity * 0.08; // Much more conservative - preserve shape identity
                
                // Use simpler, lower-frequency deformations to preserve original shape character
                switch (flowStyle) {
                    case 'gentle':
                        deformation = Math.sin(angle * 2 + seed * 0.1) * maxDeformation * 0.7 +
                                     Math.sin(angle * 4 + seed * 0.1) * maxDeformation * 0.3;
                        break;
                    case 'dynamic':
                        deformation = Math.sin(angle * 3 + seed * 0.1) * maxDeformation * 0.8 +
                                     Math.cos(angle * 5 + seed * 0.15) * maxDeformation * 0.4;
                        break;
                    case 'rhythmic':
                        deformation = Math.sin(angle * 1.5 + seed * 0.08) * maxDeformation * 0.9 +
                                     Math.sin(angle * 6 + seed * 0.1) * maxDeformation * 0.2;
                        break;
                    case 'chaotic':
                        deformation = Math.sin(angle * 4 + seed * 0.1) * maxDeformation * 0.6 +
                                     Math.cos(angle * 2.5 + seed * 0.12) * maxDeformation * 0.4;
                        break;
                }
                
                const newRadius = radius * (1 + deformation);
                
                return {
                    x: shapeCenter.x + newRadius * Math.cos(angle),
                    y: shapeCenter.y + newRadius * Math.sin(angle)
                };
            });
        }
        
        function seededRandom(seed) {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        }
        
        function smoothPoints(points, passes = 3) {
            let smoothed = [...points];
            
            for (let pass = 0; pass < passes; pass++) {
                const newPoints = [];
                
                for (let i = 0; i < smoothed.length; i++) {
                    const prev = smoothed[(i - 1 + smoothed.length) % smoothed.length];
                    const current = smoothed[i];
                    const next = smoothed[(i + 1) % smoothed.length];
                    
                    // Weighted average for smooth transitions
                    const smoothFactor = 0.35; // Slightly more aggressive smoothing
                    const x = current.x * (1 - smoothFactor) + (prev.x + next.x) * smoothFactor * 0.5;
                    const y = current.y * (1 - smoothFactor) + (prev.y + next.y) * smoothFactor * 0.5;
                    
                    newPoints.push({ x, y });
                }
                
                smoothed = newPoints;
            }
            
            return smoothed;
        }
        
        function showOriginalPreview(svgContent) {
            const previewArea = document.getElementById('originalPreview');
            previewArea.innerHTML = svgContent;
            
            const svg = previewArea.querySelector('svg');
            if (svg) {
                svg.style.width = '100%';
                svg.style.height = '100%';
                svg.style.maxHeight = '220px';
            }
        }
        
        function showVariation() {
            const display = document.getElementById('variationDisplay');
            
            const bounds = calculateBounds(currentVariation);
            const padding = Math.max(bounds.width, bounds.height) * 0.15;
            const viewBoxX = bounds.minX - padding;
            const viewBoxY = bounds.minY - padding;
            const viewBoxWidth = bounds.width + (padding * 2);
            const viewBoxHeight = bounds.height + (padding * 2);
            
            const flowStyle = document.getElementById('flowStyle').value;
            const flowName = document.getElementById('flowStyle').options[document.getElementById('flowStyle').selectedIndex].text;
            
            // Use global colors or random colors based on checkbox
            let fillStyle;
            if (document.getElementById('randomColors').checked) {
                const color1 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
                const color2 = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
                fillStyle = `url(#grad${variationCounter})`;
                var gradientDef = `
                        <linearGradient id="grad${variationCounter}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:${color2};stop-opacity:0.8" />
                        </linearGradient>`;
            } else if (flowStyle === 'gentle') {
                // For gentle flow, use solid color instead of gradient
                fillStyle = globalColor;
                var gradientDef = '';
            } else {
                // For other flow styles, use gradient
                fillStyle = `url(#grad${variationCounter})`;
                var gradientDef = `
                        <linearGradient id="grad${variationCounter}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:${globalColor};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:${globalColorSecondary};stop-opacity:0.8" />
                        </linearGradient>`;
            }
            
            display.innerHTML = `
                <div class="variation-label">${flowName} #${variationCounter}</div>
                <svg class="variation-svg" viewBox="${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}">
                    <defs>${gradientDef}
                    </defs>
                    <path d="${currentVariation}" fill="${fillStyle}" stroke="none"/>
                </svg>
            `;
        }
        
        function calculateBounds(pathData) {
            const numbers = pathData.match(/[+-]?([0-9]*[.])?[0-9]+/g)?.map(n => parseFloat(n)) || [];
            
            const points = [];
            for (let i = 0; i < numbers.length; i += 2) {
                if (i + 1 < numbers.length) {
                    points.push({ x: numbers[i], y: numbers[i + 1] });
                }
            }
            
            if (points.length === 0) {
                return { minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 };
            }
            
            const minX = Math.min(...points.map(p => p.x));
            const maxX = Math.max(...points.map(p => p.x));
            const minY = Math.min(...points.map(p => p.y));
            const maxY = Math.max(...points.map(p => p.y));
            
            return {
                minX, maxX, minY, maxY,
                width: maxX - minX,
                height: maxY - minY
            };
        }
        
        function collectVariation() {
            if (!currentVariation) {
                showError('No variation to collect. Please generate a variation first.');
                return;
            }
            
            collectedVariations.push(currentVariation);
            updateCollectionStatus();
            
            if (collectedVariations.length >= 2) {
                document.getElementById('animateBtn').disabled = false;
            }
            
            showSuccess(`Collected variation #${variationCounter}! Total: ${collectedVariations.length}`);
        }
        
        function updateCollectionStatus() {
            const status = document.getElementById('collectionStatus');
            if (collectedVariations.length === 0) {
                status.textContent = 'No flow sequence generated yet';
            } else {
                status.textContent = `${collectedVariations.length} flow frames collected`;
            }
        }
        
        function createAnimation() {
            if (collectedVariations.length < 2) {
                showError('Need at least 2 variations for animation');
                return;
            }
            
            const animationSVG = generateFlowAnimation();
            const previewArea = document.getElementById('animationPreview');
            const displayArea = document.getElementById('animationDisplay');
            
            displayArea.innerHTML = animationSVG;
            previewArea.style.display = 'block';
            
            const includePattern = document.getElementById('includePattern').checked;
            const patternType = document.getElementById('patternType').value;
            const patternName = document.getElementById('patternType').options[document.getElementById('patternType').selectedIndex].text;
            const speed = parseFloat(document.getElementById('animationSpeed').value);
            const duration = (5.0 / speed).toFixed(1);
            const flowStyle = document.getElementById('flowStyle').value;
            
            let message = `Smooth ${flowStyle} flow animation ready with ${collectedVariations.length} frames`;
            if (includePattern) {
                message += ` and ${patternName} pattern`;
            }
            message += ` at ${speed}x speed (${duration}s per cycle)!`;
            
            showSuccess(message);
        }
        
        function generateFlowAnimation() {
            // Calculate clean bounds
            const allBounds = collectedVariations.map(v => calculateBounds(v));
            const minX = Math.min(...allBounds.map(b => b.minX));
            const maxX = Math.max(...allBounds.map(b => b.maxX));
            const minY = Math.min(...allBounds.map(b => b.minY));
            const maxY = Math.max(...allBounds.map(b => b.maxY));
            
            // Create clean, simple viewBox
            const padding = 20;
            const viewBoxX = Math.floor(minX - padding);
            const viewBoxY = Math.floor(minY - padding);
            const viewBoxWidth = Math.ceil(maxX - minX + padding * 2);
            const viewBoxHeight = Math.ceil(maxY - minY + padding * 2);
            
            // Dynamic animation based on collected variations
            const animationValues = collectedVariations.join(';') + ';' + collectedVariations[0];
            
            // Generate dynamic keyTimes based on number of collected variations
            const numFrames = collectedVariations.length;
            const keyTimesArray = [];
            for (let i = 0; i <= numFrames; i++) {
                keyTimesArray.push((i / numFrames).toFixed(2));
            }
            const keyTimes = keyTimesArray.join(';');
            
            // Generate dynamic keySplines for smooth transitions
            const keySplines = Array(numFrames).fill("0.4 0 0.6 1").join(';');
            
            // Get animation speed settings
            const speedMultiplier = parseFloat(document.getElementById('animationSpeed').value);
            const morphDuration = (4.0 / speedMultiplier).toFixed(1);
            
            // Generate minimal pattern if enabled
            let patternHTML = '';
            let clipPathHTML = '';
            
            if (document.getElementById('includePattern').checked) {
                const patternType = document.getElementById('patternType').value;
                const density = parseFloat(document.getElementById('patternDensity').value);
                const opacity = parseFloat(document.getElementById('patternOpacity').value);
                
                const bounds = { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight };
                const patternElements = PatternGenerator.generatePattern(patternType, bounds, density, opacity);
                
                patternHTML = `
    <g clip-path="url(#morphClip)" opacity="0.8">
        ${patternElements}
    </g>`;
                
                clipPathHTML = `
                <clipPath id="morphClip">
                    <path>
                        <animate 
                            attributeName="d" 
                            dur="${morphDuration}s" 
                            repeatCount="indefinite"
                            values="${animationValues}"
                            keyTimes="${keyTimes}"
                            calcMode="spline"
                            keySplines="${keySplines}"
                        />
                    </path>
                </clipPath>`;
            }
            
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}" width="100%" height="100%">
                <defs>
                    <style>
                        <![CDATA[
                        .morphing-shape { 
                            fill: ${globalColor};
                        }
                        .star { 
                            fill: rgba(255,255,255,0.8); 
                        }
                        .twinkle { 
                            animation: twinkle ${(3.0 / speedMultiplier).toFixed(1)}s ease-in-out infinite alternate;
                        }
                        @keyframes twinkle { 
                            0% { opacity: 0.3; } 
                            100% { opacity: 1; } 
                        }
                        ]]>
                    </style>
                    ${clipPathHTML}
                </defs>
                
                <!-- Main morphing blob -->
                <path class="morphing-shape">
                    <animate 
                        attributeName="d" 
                        dur="${morphDuration}s" 
                        repeatCount="indefinite"
                        values="${animationValues}"
                        keyTimes="${keyTimes}"
                        calcMode="spline"
                        keySplines="${keySplines}"
                    />
                </path>
                
                <!-- Pattern overlay -->${patternHTML}
            </svg>`;
        }
        
        function downloadVariation() {
            if (!currentVariation) return;
            
            const bounds = calculateBounds(currentVariation);
            const padding = Math.max(bounds.width, bounds.height) * 0.1;
            
            const flowStyle = document.getElementById('flowStyle').value;
            
            const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bounds.minX - padding} ${bounds.minY - padding} ${bounds.width + padding * 2} ${bounds.height + padding * 2}" width="800" height="600">
                <defs>
                    <linearGradient id="downloadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${globalColor};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${globalColorSecondary};stop-opacity:0.8" />
                    </linearGradient>
                </defs>
                <path d="${currentVariation}" fill="url(#downloadGrad)" stroke="none"/>
            </svg>`;
            
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `flow-blob-${flowStyle}-variation-${variationCounter}.svg`;
            a.click();
            URL.revokeObjectURL(url);
            
            showSuccess(`Downloaded ${flowStyle} flow variation #${variationCounter}!`);
        }
        
        function downloadAnimation() {
            if (collectedVariations.length < 2) return;
            
            const animationSVG = generateFlowAnimation();
            const blob = new Blob([animationSVG], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            const includePattern = document.getElementById('includePattern').checked;
            const patternType = document.getElementById('patternType').value;
            const speed = parseFloat(document.getElementById('animationSpeed').value);
            const flowStyle = document.getElementById('flowStyle').value;
            
            let filename = `smooth-flow-${flowStyle}-animation-${collectedVariations.length}frames`;
            if (includePattern) {
                filename += `-with-${patternType}`;
            }
            if (speed !== 1.0) {
                filename += `-${speed}x-speed`;
            }
            filename += '.svg';
            
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            
            let message = `Downloaded smooth ${flowStyle} flow animation with ${collectedVariations.length} frames`;
            if (includePattern) {
                message += ` and ${patternType} pattern`;
            }
            if (speed !== 1.0) {
                message += ` at ${speed}x speed`;
            }
            message += '!';
            
            showSuccess(message);
        }
        
        function enableControls() {
            document.getElementById('generateBtn').disabled = false;
            document.getElementById('batchBtn').disabled = false;
        }
        
        function resetAll() {
            originalPath = '';
            originalPoints = [];
            currentVariation = '';
            variationCounter = 0;
            collectedVariations = [];
            
            // Reset colors
            globalColor = '#54aa95';
            globalColorSecondary = '#764ba2';
            document.getElementById('colorPicker').value = globalColor;
            updateColorInput(globalColor);
            
            document.getElementById('originalPreview').innerHTML = '<div class="placeholder-text">Upload your SVG to start</div>';
            document.getElementById('variationDisplay').innerHTML = '<div class="placeholder-text">Your generated variation will appear here</div>';
            document.getElementById('animationPreview').style.display = 'none';
            
            document.getElementById('generateBtn').disabled = true;
            document.getElementById('downloadBtn').disabled = true;
            document.getElementById('collectBtn').disabled = true;
            document.getElementById('animateBtn').disabled = true;
            document.getElementById('batchBtn').disabled = true;
            
            updateCollectionStatus();
            showSuccess('Reset complete. Ready for a new shape!');
        }
        
        function showError(message) {
            const status = document.getElementById('statusMessage');
            status.textContent = message;
            status.className = 'status-message error';
            status.style.display = 'block';
        }
        
        function showSuccess(message) {
            const status = document.getElementById('statusMessage');
            status.textContent = message;
            status.className = 'status-message success';
            status.style.display = 'block';
        }