import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


import SolarInfo from "./Solar-data";
import MapPicker from "./Map";
import TopProgressBar from "./progress";

function FrontPage() {
  const [isTable, setIsTable] = useState(false);
  const [isLoading, setLoading] = useState(false);
  // const [hasFetched, setHasFetched] = useState(true);
  const [data, setData] = useState<{ month: string; val: number }[]>([]);
  const [lat, setLatitude] = useState("28.7041")
  const [long, setLongitude] = useState("77.1025")
  const [getinfo, setGetInfo] = useState(false);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        console.log(`your location,lat: ${latitude}, long: ${longitude}]`)

        await fetchData(latitude.toString(), longitude.toString());
        setLoading(false);
      },
      error => {
        console.error("Location access denied", error);
        alert("Location access is needed for solar data.");
        setLoading(false);
      }
    );
  }, []);



  async function fetchData(lat = "28.7041", long = "77.1025") {
    try {
      setLoading(true);
      // setHasFetched(false);
      const res = await fetch("/api/index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: long }),
      });

      const json = await res.json();
      // data: [{month:,val:},{},{}...]
      setData(json.data);
      setIsTable(true);
      console.log(json);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);

    }
  }



  // user submsitted- setlat,long,isAddress to true:
  // call fetch data:

  // user enter address->show monthyl average of radiation:
  function handleMapSubmit(coords: number[]) {
    setLatitude(coords[0].toString());
    setLongitude(coords[1].toString());
    if (getinfo) {
      fetchData(coords[0].toString(), coords[1].toString());
      setGetInfo(false);
    }

  }

  return (<>
    {/* <h3 className="mb-4 text-center" style={{ color: "white" }}>Solar Panel Feasibility Test</h3> */}
    <TopProgressBar loading={isLoading}/>

    <h2 style={{ color: "white", fontWeight: "700", letterSpacing: "1px", textAlign: "center" }}>
      PHOTON <span style={{ fontWeight: "400" }}>— Solar Energy Assessment</span>
    </h2>
    <div className="topbar">
      <div className="introtext">
        <p className="lead rounded bg-white p-3">
          This interactive web application provides a reliable estimate of the
          <strong> annual solar energy potential </strong> for any selected location worldwide.
          Simply choose a location on the map and retrieve results using default system parameters.<br /><br />

          For greater accuracy, you can adjust technical inputs such as system specifications,
          panel efficiency, and installation parameters. The tool dynamically recalculates to
          deliver projections tailored to your configuration.
        </p>
      </div>

      <div className="mapArea">
        <div className="mapBox">
          <MapPicker setLocation={handleMapSubmit} />
        </div>

        {<p>Latitide: {lat}, Longitude: {long} </p>}
        <button type="button" className="btn btn-primary" onClick={() => fetchData(lat, long)}>Get Info</button>


      </div>

    </div>


    <div className="container mt-4">





       {/* { isLoading && <div className="spinner-border text-light" role="status">

      </div>} */}
      {<SolarInfo monthAvg={data} />} 




      {isTable && (
        <div className="table-responsive">
          <table className="table table-success table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Month</th>
                <th scope="col">Irradiance (kWh/m²/day)</th>
              </tr>
            </thead>
            <tbody>


              {data.map((item, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.month}</td>
                  <td>{item.val.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  </>
  );
}

export default FrontPage;
