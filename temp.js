// temp.js
document.addEventListener('DOMContentLoaded', () => {
    const input      = document.getElementById('input');
    const fromUnit   = document.getElementById('FromUnit');
    const toUnit     = document.getElementById('ToUnit');
    const convertBtn = document.querySelector('.convert-btn');
    const result     = document.getElementById('result');

    const missing = [];
    if (!input) missing.push('input#input');
    if (!fromUnit) missing.push('select#FromUnit');
    if (!toUnit) missing.push('select#ToUnit');
    if (!result) missing.push('element#result');
    if (missing.length) {
        console.error('temp.js: Missing required elements in DOM:', missing.join(', '));
        if (result) result.textContent = `Error: missing elements: ${missing.join(', ')}`;
        return;
    }

    result.setAttribute('aria-live', 'polite');

    // Conversion functions
    function celsiusToFahrenheit(c) { return c * 9/5 + 32; }
    function fahrenheitToCelsius(f) { return (f - 32) * 5/9; }
    function celsiusToKelvin(c)     { return c + 273.15; }
    function kelvinToCelsius(k)     { return k - 273.15; }
    function fahrenheitToKelvin(f)  { return celsiusToKelvin(fahrenheitToCelsius(f)); }
    function kelvinToFahrenheit(k)  { return celsiusToFahrenheit(kelvinToCelsius(k)); }

    // Normalize unit strings coming from option values or labels into canonical 'celsius'|'fahrenheit'|'kelvin'
    function normalizeUnit(raw) {
        if (raw == null) return undefined;
        const s = String(raw).toLowerCase().trim();
        // remove parentheses and internal content: e.g., "celsius(c)" => "celsius"
        const stripped = s.replace(/\(.*\)/, '').trim();
        if (stripped === 'celsius' || stripped === 'c') return 'celsius';
        if (stripped === 'fahrenheit' || stripped === 'f') return 'fahrenheit';
        if (stripped === 'kelvin' || stripped === 'k') return 'kelvin';
        // fallback: try to detect by substring
        if (stripped.includes('celsius') || stripped.includes('cel')) return 'celsius';
        if (stripped.includes('fahrenheit') || stripped.includes('fahr')) return 'fahrenheit';
        if (stripped.includes('kelvin') || stripped.includes('kel')) return 'kelvin';
        return undefined;
    }

    function convertValue(from, to, value) {
        if (from === to) return value;
        if (from === 'celsius' && to === 'fahrenheit') return celsiusToFahrenheit(value);
        if (from === 'fahrenheit' && to === 'celsius') return fahrenheitToCelsius(value);
        if (from === 'celsius' && to === 'kelvin') return celsiusToKelvin(value);
        if (from === 'kelvin' && to === 'celsius') return kelvinToCelsius(value);
        if (from === 'fahrenheit' && to === 'kelvin') return fahrenheitToKelvin(value);
        if (from === 'kelvin' && to === 'fahrenheit') return kelvinToFahrenheit(value);
        return undefined;
    }

    function formatUnitLabel(unit) {
        return unit === 'celsius' ? '°C' : unit === 'fahrenheit' ? '°F' : 'K';
    }

    function convert() {
        try {
            const raw = input.value == null ? '' : String(input.value).trim();
            if (raw === '') {
                result.textContent = 'Please enter a value to convert';
                return;
            }

            const normalizedNumber = raw.replace(',', '.'); // allow comma decimal
            const value = Number(normalizedNumber);
            if (!Number.isFinite(value)) {
                result.textContent = 'Please enter a valid number';
                console.warn('convert: invalid number input:', raw, '->', normalizedNumber, value);
                return;
            }

            const fromRaw = fromUnit.value;
            const toRaw   = toUnit.value;
            const from = normalizeUnit(fromRaw);
            const to   = normalizeUnit(toRaw);

            if (!from || !to) {
                result.textContent = 'Unsupported unit selection';
                console.error('convert: could not normalize units', { fromRaw, toRaw });
                return;
            }

            const converted = convertValue(from, to, value);

            if (converted === undefined) {
                result.textContent = 'Unsupported unit conversion';
                console.error('convert: unsupported conversion', { from, to });
                return;
            }

            result.textContent = `${converted.toFixed(4)} ${formatUnitLabel(to)}`;
        } catch (err) {
            console.error('convert: unexpected error', err);
            result.textContent = 'An unexpected error occurred. See console.';
        }
    }

    // Debounce typing
    let timeoutId = null;
    function debounceConvert() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(convert, 300);
    }

    // Event listeners
    input.addEventListener('input', debounceConvert);
    input.addEventListener('change', convert);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            convert();
        }
    });
    fromUnit.addEventListener('change', convert);
    toUnit.addEventListener('change', convert);
    if (convertBtn) convertBtn.addEventListener('click', convert);

    // Initial message
    result.textContent = 'Enter a value to convert';

    console.info('temp.js initialized', {
        input: !!input,
        fromUnitValue: fromUnit.value,
        toUnitValue: toUnit.value
    });
});