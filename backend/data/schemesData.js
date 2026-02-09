// Mock database of government schemes
export const schemes = [
    {
        id: 1,
        name: 'PM-Kisan Samman Nidhi',
        description: 'Financial benefit of Rs. 6000/- per year in three equal installments to all landholding farmers families.',
        state: 'All', // 'All' means central scheme
        maxLandSize: 20, // Applicable for almost all, but let's say up to 20 acres for general
        link: 'https://pmkisan.gov.in/'
    },
    {
        id: 2,
        name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'Crop insurance scheme to provide financial support to farmers suffering crop loss/damage arising out of unforeseen events.',
        state: 'All',
        maxLandSize: 100,
        link: 'https://pmfby.gov.in/'
    },
    {
        id: 3,
        name: 'Punjab Kisan Credit Limit',
        description: 'Low interest loans for farmers in Punjab.',
        state: 'Punjab',
        maxLandSize: 50,
        link: '#'
    },
    {
        id: 4,
        name: 'Rythu Bandhu Scheme',
        description: 'Investment support scheme for farmers in Telangana.',
        state: 'Telangana',
        maxLandSize: 100,
        link: 'http://rythubandhu.telangana.gov.in/'
    },
    {
        id: 5,
        name: 'Kalia Scheme',
        description: 'Financial assistance to cultivators and landless agricultural laborers.',
        state: 'Odisha',
        maxLandSize: 5, // Small/Marginal farmers
        link: 'https://kalia.odisha.gov.in/'
    },
    {
        id: 6,
        name: 'Tamil Nadu Free Power Supply',
        description: 'Free electricity for farmers for irrigation.',
        state: 'Tamil Nadu',
        maxLandSize: 10,
        link: 'https://www.tangedco.gov.in/'
    }
]
