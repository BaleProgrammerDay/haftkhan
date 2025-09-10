import { useState } from "react";
import { Khan1 } from "./pages/khan-1/Khan1";

import { Khan2 } from "./pages/khan-2/Khan2";

function App() {
    const [step, setStep] = useState(1);

    return (
        <>
            {step === 1 && <Khan1 setStep={setStep} />}
            {step === 2 && <Khan2 setStep={setStep} />}
        </>
    );
}

export default App;
