// Simplified WHO Child Growth Standards (0-24 months)
// Format: [Month, P3, P15, P50, P85, P97]
// P3: 3rd Percentile (Lower bound)
// P50: Median
// P97: 97th Percentile (Upper bound)

type GrowthData = [number, number, number, number, number, number];

interface GenderData {
    weight: GrowthData[]; // kg
    length: GrowthData[]; // cm
}

export const WHO_DATA: { boys: GenderData; girls: GenderData } = {
    boys: {
        weight: [
            [0, 2.5, 2.9, 3.3, 3.9, 4.4],
            [1, 3.4, 3.9, 4.5, 5.1, 5.8],
            [2, 4.3, 4.9, 5.6, 6.3, 7.1],
            [3, 5.0, 5.7, 6.4, 7.2, 8.0],
            [4, 5.6, 6.2, 7.0, 7.9, 8.7],
            [5, 6.0, 6.7, 7.5, 8.4, 9.3], // ~6m
            [6, 6.4, 7.1, 7.9, 8.8, 9.8],
            [9, 7.1, 8.0, 8.9, 10.0, 11.0],
            [12, 7.7, 8.6, 9.6, 10.8, 12.0],
            [15, 8.3, 9.2, 10.3, 11.6, 12.8],
            [18, 8.8, 9.7, 10.9, 12.3, 13.7],
            [21, 9.2, 10.2, 11.5, 12.9, 14.5],
            [24, 9.7, 10.8, 12.2, 13.6, 15.3]
        ],
        length: [
            [0, 46.1, 48.0, 49.9, 51.8, 53.7],
            [3, 57.3, 59.1, 61.4, 63.3, 65.5],
            [6, 63.3, 65.1, 67.6, 70.0, 71.9],
            [9, 67.5, 69.4, 72.0, 74.5, 76.5],
            [12, 71.0, 73.0, 75.7, 78.3, 80.5],
            [15, 74.1, 76.1, 79.1, 81.8, 84.2],
            [18, 76.9, 79.0, 82.3, 85.1, 87.7],
            [24, 81.7, 84.1, 87.8, 90.9, 93.9]
        ]
    },
    girls: {
        weight: [
            [0, 2.4, 2.8, 3.2, 3.7, 4.2],
            [1, 3.2, 3.6, 4.2, 4.8, 5.5],
            [2, 3.9, 4.5, 5.1, 5.8, 6.6],
            [3, 4.5, 5.2, 5.8, 6.6, 7.5],
            [4, 5.0, 5.7, 6.4, 7.3, 8.2],
            [5, 5.4, 6.1, 6.9, 7.8, 8.8],
            [6, 5.7, 6.5, 7.3, 8.2, 9.3],
            [9, 6.5, 7.3, 8.2, 9.3, 10.5],
            [12, 7.0, 7.9, 8.9, 10.2, 11.5],
            [15, 7.6, 8.5, 9.6, 10.9, 12.4],
            [18, 8.1, 9.0, 10.2, 11.6, 13.3],
            [21, 8.6, 9.6, 10.9, 12.4, 14.2],
            [24, 9.0, 10.0, 11.5, 13.2, 14.8]
        ],
        length: [
            [0, 45.4, 47.3, 49.1, 51.0, 52.9],
            [3, 55.6, 57.6, 59.8, 62.0, 64.0],
            [6, 61.2, 63.3, 65.7, 68.0, 70.3],
            [9, 65.3, 67.5, 70.1, 72.8, 75.0],
            [12, 68.9, 71.1, 74.0, 76.8, 79.2],
            [15, 72.0, 74.3, 77.5, 80.4, 83.0],
            [18, 74.9, 77.2, 80.7, 83.8, 86.6],
            [24, 80.0, 82.5, 86.4, 89.8, 92.9]
        ]
    }
};

/**
 * Interpolates P50, P3, P97 for a given month.
 */
export const getPercentiles = (gender: 'boy' | 'girl' | 'unknown', type: 'weight' | 'length', month: number) => {
    const data = WHO_DATA[gender === 'unknown' ? 'boys' : gender][type];

    // Find closest points
    let lower = data[0];
    let upper = data[data.length - 1];

    for (let i = 0; i < data.length - 1; i++) {
        if (month >= data[i][0] && month <= data[i + 1][0]) {
            lower = data[i];
            upper = data[i + 1];
            break;
        }
    }

    if (lower === upper) return { p3: lower[1], p50: lower[3], p97: lower[5] };

    const ratio = (month - lower[0]) / (upper[0] - lower[0]);

    const interpolate = (idx: number) => lower[idx] + (upper[idx] - lower[idx]) * ratio;

    return {
        p3: interpolate(1),
        p15: interpolate(2),
        p50: interpolate(3),
        p85: interpolate(4),
        p97: interpolate(5)
    };
};
