// import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(`url: ${req.url}`);

    const { latitude = "20.701", longitude = "70.011" } = req.body || {};
    console.log(`lat: ${latitude}, long: ${longitude}`);

    const url = `https://power.larc.nasa.gov/api/temporal/monthly/point?start=2014&end=2024&latitude=${latitude}&longitude=${longitude}&community=re&parameters=ALLSKY_SFC_SW_DWN&format=json&units=metric&header=true`;

    const result = await fetch(url);
    const data = await result.json();

    const yearlyData = data.properties.parameter.ALLSKY_SFC_SW_DWN;
    const month = {
      Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
      Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };
    const map = {
      "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
      "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
    };

    for (let year in yearlyData) {
      const monthCode = year.slice(-2);
      if (map[monthCode]) {
        month[map[monthCode]] += yearlyData[year];
      }
    }

    const yearCount = 2024 - 2014 + 1;
    for (let mon in month) {
      month[mon] = Number((month[mon] / yearCount).toFixed(4));
    }

    let finaldata = [];
    for (let m in month) {
      finaldata.push({ month: m, val: month[m] });
    }

    return res.status(200).json({ data: finaldata });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
