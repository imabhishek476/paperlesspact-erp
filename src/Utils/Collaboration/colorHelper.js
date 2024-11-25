

// Assuming you have a function to convert HSV to RGB
function HSVtoRGB(h, s, v) {
    let r, g, b, i, f, p, q, t;

    if (s === 0) {
        return { r: v, g: v, b: v };
    }

    h *= 6;
    i = Math.floor(h);
    f = h - i;
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }

    return { r: r, g: g, b: b };
}
const initialise = ()=>{
    let colors = [];

for (let i = 0; i < 10; i++) {
    const hue = (i * 0.618033988749895) % 1.0;
    const saturation = 0.5;
    const value = 1.0;

    colors[i] = HSVtoRGB(hue, saturation, value);
}
return colors;
}
export const getColor = (index)=>{
    const color = initialise();
    return color[index%10];
}

export const getColorPreset = (index) =>{
    const entries = [['Cat', 'rgb(125, 50, 0)'], ['Dog', 'rgb(100, 0, 0)'], ['Rabbit', 'rgb(150, 0, 0)'], ['Frog', 'rgb(200, 0, 0)'], ['Fox', 'rgb(200, 75, 0)'], ['Hedgehog', 'rgb(0, 75, 0)'], ['Pigeon', 'rgb(0, 125, 0)'], ['Squirrel', 'rgb(75, 100, 0)'], ['Bear', 'rgb(125, 100, 0)'], ['Tiger', 'rgb(0, 0, 150)'], ['Leopard', 'rgb(0, 0, 200)'], ['Zebra', 'rgb(0, 0, 250)'], ['Wolf', 'rgb(0, 100, 150)'], ['Owl', 'rgb(0, 100, 100)'], ['Gull', 'rgb(100, 0, 100)'], ['Squid', 'rgb(150, 0, 150)']];
    return entries[index%10][1];
}