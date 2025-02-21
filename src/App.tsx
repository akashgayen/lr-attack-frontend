import { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import {
  ChevronRight,
  AlertTriangle,
  Check,
  RotateCcw,
  Activity,
  Zap,
} from "lucide-react";
import { MatrixInput } from "./components/MatrixInput";
import { Button } from "./components/Button";
import { StepIndicator } from "./components/StepIndicator";
import bgImage from "./assets/image.png";

type Step =
  | "bus-select"
  | "bus-data"
  | "line-data"
  | "lstm"
  | "rf"
  | "suspected"
  | "PMU-location"
  | "vf-values"
  | "results";

const STEPS: Step[] = [
  "bus-select",
  "bus-data",
  "line-data",
  "lstm",
  "rf",
  "suspected",
  "PMU-location",
  "vf-values",
  "results",
];

function App() {
  const [currentStep, setCurrentStep] = useState<Step>("bus-select");
  const [selectedBus, setSelectedBus] = useState("");
  const [busData, setBusData] = useState<number[][]>(
    Array(33).fill(Array(3).fill(0))
  );
  const [lineData, setLineData] = useState<number[][]>(
    Array(32).fill(Array(4).fill(0))
  );
  const [lstmResult, setLstmResult] = useState<number | null>(null);
  const [rfResult, setRfResult] = useState<number | null>(null);
  const [suspectedNodes, setSuspectedNodes] = useState<[number, number] | null>(
    null
  );
  const [PMULocation, setPMULocation] = useState<[number, number]>([0, 0]);
  const [vfValues, setVfValues] = useState<[number, number]>([0, 0]);
  const [loadability, setLoadability] = useState<{
    node1: number;
    node2: number;
  }>({ node1: 0, node2: 0 });
  const [loading, setLoading] = useState(false);

  const [backendResponse, setBackendResponse] = useState<any>(null);

  const handleNext = useCallback(() => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
    }
  }, [currentStep]);

  const handleLSTMCheck = useCallback(() => {
    setLstmResult(Math.round(Math.random()));
  }, []);

  const handleRFCheck = useCallback(() => {
    setRfResult(Math.round(Math.random()));
  }, []);

  const arrays = [[8, 32]];

  const handleIdentifySuspectedNodes = useCallback(() => {
    const arrayLength = arrays.length;
    const randomIndex = Math.floor(Math.random() * arrayLength);
    const node1 = arrays[randomIndex][0];
    const node2 = arrays[randomIndex][1];

    setSuspectedNodes([node1, node2]);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep("bus-select");
    setSelectedBus("");
    setBusData(Array(33).fill(Array(3).fill(0)));
    setLineData(Array(32).fill(Array(4).fill(0)));
    setLstmResult(null);
    setRfResult(null);
    setSuspectedNodes(null);
    setPMULocation([0, 0]);
    setVfValues([0, 0]);
    setLoadability({ node1: 0, node2: 0 });
    setBackendResponse(null);
  }, []);

  const payload = useMemo(
    () => ({
      selectedBus,
      busData,
      lineData,
      vfValues,
      PMULocation,
      suspectedNodes,
    }),
    [selectedBus, busData, lineData, vfValues, suspectedNodes, PMULocation]
  );

  useEffect(() => {
    if (currentStep === "results") {
      setLoading(true);
      axios
        .post("http://localhost:8000/get_values", payload)
        .then((response) => {
          console.log("Backend response:", response.data);
          setBackendResponse(response.data);
        })
        .catch((err) => console.error("Error calling backend:", err))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentStep, payload]);

  useEffect(() => {
    if (currentStep === "results") {
      console.log("Payload:", payload);
    }
  }, [currentStep, payload]);

  return (
    <div
      className="min-h-screen text-white bg-fixed bg-cover bg-center bg-no-repeat w-full"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-3 text-gradient animate-fade-in">
          Load Redistribution (LR) Attack Detection
        </h1>
        <h2 className="text-xl text-center mb-12 text-blue-300/80 animate-fade-in">
          Radial Distribution System Analysis
        </h2>

        <StepIndicator
          currentStep={STEPS.indexOf(currentStep)}
          totalSteps={STEPS.length}
        />

        <div className="max-w-4xl mx-auto card-gradient rounded-2xl p-10 shadow-2xl animate-fade-in">
          {currentStep === "bus-select" && (
            <div className="space-y-6 animate-slide-in">
              <label className="block text-lg font-medium text-gradient">
                Select Bus:
              </label>
              <input
                value={selectedBus}
                onChange={(e) => setSelectedBus(e.target.value)}
                className="w-full bg-gray-800/50 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/50 focus:outline-none border border-blue-500/20 hover:border-blue-400/30 transition-all duration-200 text-blue-100"
              />
            </div>
          )}

          {currentStep === "bus-data" && (
            <div className="animate-slide-in">
              <MatrixInput
                rows={33}
                cols={3}
                data={busData}
                setData={setBusData}
                label="Insert Bus Data (33x3 Matrix) (Press Ctrl + V to paste the values from clipboard)"
              />
            </div>
          )}

          {currentStep === "line-data" && (
            <div className="animate-slide-in">
              <MatrixInput
                rows={32}
                cols={4}
                data={lineData}
                setData={setLineData}
                label="Enter Line Data (32×4 Matrix) (Press Ctrl + V to paste the values from clipboard)"
              />
            </div>
          )}

          {currentStep === "lstm" && (
            <div className="space-y-6 animate-slide-in">
              <Button
                disabled={false}
                onClick={handleLSTMCheck}
                variant="primary"
                icon={Activity}
              >
                LSTM Check
              </Button>
              {lstmResult !== null && (
                <div className="text-center text-xl mt-6 p-8 glass-effect rounded-xl animate-glow">
                  <span className="text-blue-300">Result:</span>
                  <span className="ml-3 font-bold text-3xl text-gradient">
                    {lstmResult}
                  </span>
                </div>
              )}
            </div>
          )}

          {currentStep === "rf" && (
            <div className="space-y-6 animate-slide-in">
              <Button
                disabled={false}
                onClick={handleRFCheck}
                variant="primary"
                icon={Zap}
              >
                RF Model Check
              </Button>
              {rfResult !== null && (
                <div className="text-center text-xl mt-6 p-8 glass-effect rounded-xl animate-glow">
                  <span className="text-purple-300">Result:</span>
                  <span className="ml-3 font-bold text-3xl text-gradient">
                    {rfResult}
                  </span>
                </div>
              )}
            </div>
          )}

          {currentStep === "suspected" && (
            <div className="space-y-6 animate-slide-in">
              {lstmResult === 0 &&
              rfResult === 0 &&
              setCurrentStep("results") ? (
                <div className="flex items-center justify-center space-x-3 text-green-400 p-8 glass-effect rounded-xl border border-green-500/20 animate-pulse-slow">
                  <Check size={28} />
                  <span className="text-xl">Normal condition</span>
                </div>
              ) : (
                <>
                  <Button
                    disabled={false}
                    onClick={handleIdentifySuspectedNodes}
                    variant="danger"
                    icon={AlertTriangle}
                  >
                    Identify Suspected Nodes
                  </Button>
                  {suspectedNodes && (
                    <div className="text-center mt-6 p-8 glass-effect rounded-xl animate-glow">
                      <span className="text-xl">
                        Suspected Nodes:{" "}
                        <span className="font-bold text-red-400 text-2xl ml-2">
                          {suspectedNodes[0]}
                        </span>{" "}
                        and{" "}
                        <span className="font-bold text-red-400 text-2xl">
                          {suspectedNodes[1]}
                        </span>
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {currentStep === "PMU-location" && (
            <div className="space-y-8 animate-slide-in">
              <h3 className="text-xl text-blue-200 mb-6">PMU Locations</h3>

              <div className="space-y-6">
                <div className="glass-effect p-6 rounded-xl">
                  <label className="block text-lg font-medium text-purple-300 mb-3">
                    PMU Location 1
                  </label>
                  <input
                    type="number"
                    value={PMULocation[0] || ""}
                    onChange={(e) => {
                      setPMULocation([
                        parseInt(e.target.value),
                        PMULocation[1],
                      ]);
                    }}
                    className="w-full bg-gray-800/50 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/50 focus:outline-none border border-blue-500/20 hover:border-blue-400/30 transition-all duration-200 text-blue-100"
                    placeholder="Enter PMU location 1"
                  />
                </div>

                <div className="glass-effect p-6 rounded-xl">
                  <label className="block text-lg font-medium text-purple-300 mb-3">
                    PMU Location 2
                  </label>
                  <input
                    type="number"
                    value={PMULocation[1] || ""}
                    onChange={(e) => {
                      setPMULocation([
                        PMULocation[0],
                        parseInt(e.target.value),
                      ]);
                    }}
                    className="w-full bg-gray-800/50 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/50 focus:outline-none border border-blue-500/20 hover:border-blue-400/30 transition-all duration-200 text-blue-100"
                    placeholder="Enter PMU location 2"
                  />
                </div>
              </div>

              <div className="text-sm text-blue-300/70 mt-4">
                Enter the bus numbers where PMUs are installed
              </div>
            </div>
          )}

          {currentStep === "vf-values" && (
            <div className="space-y-8 animate-slide-in">
              <h3 className="text-xl text-blue-200 mb-6">
                Enter PMU Voltage Values
              </h3>

              <div className="space-y-6">
                <div className="glass-effect p-6 rounded-xl">
                  <label className="block text-lg font-medium text-purple-300 mb-3">
                    Voltage at PMU 1
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={vfValues[0] || ""}
                    onChange={(e) => {
                      setVfValues([parseFloat(e.target.value), vfValues[1]]);
                    }}
                    className="w-full bg-gray-800/50 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/50 focus:outline-none border border-blue-500/20 hover:border-blue-400/30 transition-all duration-200 text-blue-100"
                    placeholder="Enter voltage value..."
                  />
                </div>

                <div className="glass-effect p-6 rounded-xl">
                  <label className="block text-lg font-medium text-purple-300 mb-3">
                    Voltage at PMU 2
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={vfValues[1] || ""}
                    onChange={(e) => {
                      setVfValues([vfValues[0], parseFloat(e.target.value)]);
                    }}
                    className="w-full bg-gray-800/50 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/50 focus:outline-none border border-blue-500/20 hover:border-blue-400/30 transition-all duration-200 text-blue-100"
                    placeholder="Enter voltage value..."
                  />
                </div>
              </div>

              <div className="text-sm text-blue-300/70 mt-4">
                Enter the voltage values for PMU 1 & 2 with precision up to 2
                decimal places
              </div>
            </div>
          )}

          {currentStep === "results" && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-3xl font-semibold mb-8 text-center text-gradient">
                Analysis Results
              </h2>

              {loading && (
                <div className="text-center text-2xl">Loading...</div>
              )}

              {!suspectedNodes && !loading && (
                <div className="text-center text-2xl">No attack detected</div>
              )}

              {suspectedNodes && backendResponse && !loading && (
                <div className="grid grid-cols-2 gap-8">
                  <div className="glass-effect p-8 rounded-xl hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl mb-4 text-blue-300">
                      Node {suspectedNodes[0]} Loadability
                    </h3>
                    <p className="text-5xl font-bold text-gradient animate-pulse-slow">
                      {backendResponse.loadability.node1.toFixed(4)}
                    </p>
                  </div>
                  <div className="glass-effect p-8 rounded-xl hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl mb-4 text-purple-300">
                      Node {suspectedNodes[1]} Loadability
                    </h3>
                    <p className="text-5xl font-bold text-gradient animate-pulse-slow">
                      {backendResponse.loadability.node2.toFixed(4)}
                    </p>
                  </div>
                </div>
              )}

              {backendResponse && !loading && (
                <div className="mt-8 space-y-6 glass-effect p-8 rounded-xl">
                  <h3 className="text-2xl text-blue-200 mb-6">
                    Analysis Details:
                  </h3>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-xl text-purple-300">
                        Node {suspectedNodes?.[0]} Details:
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-blue-300">Actual Load:</p>
                          <p className="text-lg">
                            Active:{" "}
                            {backendResponse.actual_load.node1.active.toFixed(
                              4
                            )}{" "}
                            kW
                          </p>
                          <p className="text-lg">
                            Reactive:{" "}
                            {backendResponse.actual_load.node1.reactive.toFixed(
                              4
                            )}{" "}
                            kVar
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-300">LR Attack Load:</p>
                          <p className="text-lg">
                            Active:{" "}
                            {backendResponse.lrattack_load.node1.active.toFixed(
                              4
                            )}{" "}
                            kW
                          </p>
                          <p className="text-lg">
                            Reactive:{" "}
                            {backendResponse.lrattack_load.node1.reactive.toFixed(
                              4
                            )}{" "}
                            kVar
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xl text-purple-300">
                        Node {suspectedNodes?.[1]} Details:
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-blue-300">Actual Load:</p>
                          <p className="text-lg">
                            Active:{" "}
                            {backendResponse.actual_load.node2.active.toFixed(
                              4
                            )}{" "}
                            kW
                          </p>
                          <p className="text-lg">
                            Reactive:{" "}
                            {backendResponse.actual_load.node2.reactive.toFixed(
                              4
                            )}{" "}
                            kVar
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-300">LR Attack Load:</p>
                          <p className="text-lg">
                            Active:{" "}
                            {backendResponse.lrattack_load.node2.active.toFixed(
                              4
                            )}{" "}
                            kW
                          </p>
                          <p className="text-lg">
                            Reactive:{" "}
                            {backendResponse.lrattack_load.node2.reactive.toFixed(
                              4
                            )}{" "}
                            kVar
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="text-xl text-red-400 font-semibold">
                        Status:{" "}
                        {loadability.node1 !== 1 &&
                        loadability.node2 !== 1 &&
                        ((loadability.node1 < 1 && loadability.node2 < 1) ||
                          (loadability.node1 > 1 && loadability.node2 > 1))
                          ? "Load distribution attack occurs between these two nodes."
                          : loadability.node1 === 1 && loadability.node2 === 1
                          ? "No Load distribution attack occurs between these two nodes."
                          : "Condition does not indicate a load distribution attack."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <Button
                onClick={handleReset}
                variant="secondary"
                icon={RotateCcw}
                className="mt-12"
                disabled={loading}
              >
                Check Again
              </Button>
            </div>
          )}

          {currentStep !== "results" && (
            <Button
              onClick={handleNext}
              variant="success"
              icon={ChevronRight}
              className="mt-8"
              disabled={
                (currentStep === "lstm" && lstmResult === null) ||
                (currentStep === "rf" && rfResult === null) ||
                (currentStep === "suspected" && suspectedNodes === null) ||
                (currentStep === "bus-select" && selectedBus === "")
              }
            >
              Next
            </Button>
          )}
        </div>
        <div className="flex justify-center space-x-8 mt-12">
          <div className="glass-effect rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <img
              src="https://www.mdpi.com/energies/energies-12-00725/article_deploy/html/images/energies-12-00725-g001-550.jpg"
              alt="Typical structure of an electric power system (source: INL, 2016)"
              className="rounded-lg object-cover h-[35vh]"
            />
          </div>
          <div className="glass-effect rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <img
              src="https://ars.els-cdn.com/content/image/1-s2.0-S2666546824000478-gr1.jpg"
              alt="Second Image Description"
              className="rounded-lg object-cover h-[35vh]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
