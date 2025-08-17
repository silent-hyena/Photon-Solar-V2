// display a form to user after geting data from the api:,
// form receive the monthly avg radiatipon obj in put:
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from "react-hook-form"

import SolarChart from "./Solar-Irradiance-Chart";
import EnergyChart from "./Energy-Production-Chart";

interface MonthAvgItem {
    month: string;
    val: number;
}

interface prop {
    monthAvg: MonthAvgItem[];
}
function SolarInfo({ monthAvg }: prop) {

    // const [isform, setFormSubmitted] = useState(false);
    const [panelArea, setPanelArea] = useState(5);
    const [unitPrice, setUnitPrice] = useState(6);
    const [efficiency, setEfficiency] = useState(0.8);


    interface FormValues {
        panelArea: number;
        unitPrice: number;
        efficiency: number;
    }

    const {
        register,
        handleSubmit,
    } = useForm<FormValues>()

    // take the sum of the monthly avg:
    let totalRad = 0;
    for (const obj of monthAvg) {
        totalRad += obj.val;
    }

    function onSubmit(data: { panelArea: number; unitPrice: number; efficiency: number }) {
        setPanelArea(data.panelArea);
        setUnitPrice(data.unitPrice);
        setEfficiency(data.efficiency);
        // setFormSubmitted(true);
        console.log(data);
    }
    return (<>
        <div className="infobar">
            <div className="solar-info-section  shadow rounded bg-white" style={{ maxWidth: "500px" }} >

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* register your input into the hook by invoking the "register" function */}
                    <label>Total Panel Area(m²):</label>
                    <input defaultValue="5" step="0.001" {...register("panelArea", { required: true, min: 0 })} className="form-control" type="number"
                    />

                    <label>Average Electricity Unit Rate(in rupees):</label>
                    <input defaultValue="6.00" step="0.001" {...register("unitPrice", { required: true, min: 0 })} className="form-control" type="number" />

                    <label>System Efficiency:</label>
                    <input defaultValue="0.8" step="0.001" {...register("efficiency", { required: true, min: 0, max: 1, valueAsNumber: true })} className="form-control" type="number" />

                    <input type="submit" className="btn btn-primary" />
                </form>
            </div>

            {<div className="card  shadow rounded bg-white" style={{ maxWidth: "500px" }} >
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Annual Energy Production(kwh):&nbsp; &nbsp; <strong>{(totalRad * panelArea * 30 * efficiency).toFixed(2)}</strong></li>
                    <li className="list-group-item">Total Amount Saved(in Rupees):&nbsp; &nbsp;<strong>{(totalRad * panelArea * 30 * efficiency * unitPrice).toFixed(2)}</strong>  </li>

                </ul>


            </div>}

        </div>
        <SolarChart data={monthAvg} />


        <EnergyChart data={[...monthAvg.map(d => ({ ...d }))]} eff={efficiency} area={panelArea} />


    </>);
}
export default SolarInfo;