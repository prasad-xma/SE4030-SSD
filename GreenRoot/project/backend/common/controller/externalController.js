const getCities = async (req, res) => {
    const namePrefix = req.query.namePrefix ?? "";

    if (typeof namePrefix !== "string" || !/^[A-Za-z\s]{0,50}$/.test(namePrefix)) {
        return res.status(400).json({ err: "Invalid city name" });
    }

    try {
        const params = new URLSearchParams({ countryIds: "LK", minPopulation: "10", namePrefix });
        const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?${params}`, {
            headers: {
                "x-rapidapi-key": process.env.RAPIDAPI_KEY,
                "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
            },
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(502).json({ err: "Failed to fetch cities" });
    }
};

const getNews = async (req, res) => {
    try {
        const params = new URLSearchParams({
            q: "agriculture",
            language: "en",
            sortBy: "popularity",
            pageSize: "10",
        });
        const response = await fetch(`https://newsapi.org/v2/everything?${params}`, {
            headers: { "X-Api-Key": process.env.NEWS_API_KEY },
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(502).json({ err: "Failed to fetch news" });
    }
};

module.exports = { getCities, getNews };
