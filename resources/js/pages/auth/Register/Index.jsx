import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import Layout from "@/layouts/RegistrationLayout"
import Personal from "@/components/Registration/PersonalInfoFields";
import Location from "@/components/Registration/LocationFields";
import FarmImage from "@/components/Registration/FarmImageFields";
import CropSelection from "@/components/Registration/CropSelectionFields";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRight, ArrowLeft, House, CircleCheck } from "lucide-react";

export default function Register({municipalities=[], categories=[], crops=[]}) {
    const {data, setData, post, processing, errors, reset} = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '',
        municipality_id: '',
        barangay_id: '',
        latitude: '',
        longitude: '',
        image_path: '',
        crops: [],
    });

    const [step, setStep] = useState(1);

    const steps = [
        { id: 1, label: "Personal" },
        { id: 2, label: "Location" },
        { id: 3, label: "Farm Image" },
        { id: 4, label: "Crops" },
    ];

    const prevStep = () => {
        setStep(step - 1);
    }
    const nextStep = () => {
        setStep(step + 1);
    }

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    }

    const isStep1Valid =
        data.name &&
        data.email &&
        data.password &&
        data.password_confirmation &&
        data.phone_number

    const isStep2Valid =
        data.municipality_id &&
        data.barangay_id &&
        data.latitude &&
        data.longitude

    return (
        <Layout>
            <form onSubmit={submit} className="p-6 md:p-8">
                <FieldSet>
                    <StepsBar step={step} />

                    {step === 1 && (
                        <Personal data={data} setData={setData} errors={errors}/>
                    )}
                    {step === 2 && (
                        <Location data={data} setData={setData} errors={errors} municipalities={municipalities}/>
                    )}
                    {step === 3 && (
                        <FarmImage data={data} setData={setData} errors={errors}/>
                    )}
                    {step === 4 && (
                        <CropSelection data={data} setData={setData} errors={errors} categories={categories} crops={crops}/>
                    )}

                    {/* Buttons */}
                    <FieldGroup className="flex-0 grid grid-cols-3 gap-4">
                        {step < 2 ? (<>
                            <Link href='/'>
                                <Button onClick={'/'} disabled={processing} type="button" variant="outline" className="col-span-1 w-full">
                                    <House/><span className="hidden md:inline">Home</span>
                                </Button>
                            </Link>
                        </>) : (<>
                            <Button onClick={prevStep} disabled={processing} type="button" variant="outline" className="col-span-1 w-full">
                                <ArrowLeft/><span className="hidden md:inline">Back</span>
                            </Button>
                        </>)}

                        {step < 5 ? (<>
                            <Button onClick={nextStep} type="button" className="col-span-3 col-start-2 w-full"
                                disabled={processing || (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                            >
                                {processing ? <Spinner/> : (<>{'Next'}<ArrowRight/></>)}
                            </Button>
                        </>) : (<>
                            <Button type="submit" disabled={processing} className="col-span-3 col-start-2 w-full">
                                {processing ? <Spinner/> : (<>{'Create'}<CircleCheck/></>)}
                            </Button>
                        </>)}
                    </FieldGroup>
                </FieldSet>
            </form>
        </Layout>
    )

    function StepsBar({ step }) {
        return (
            <div>
                <ol className="flex items-center justify-between">
                    {steps.map((s, index) => {
                        const isCompleted = step > s.id;
                        const isCurrent = step === s.id;
    
                        return (
                            <li key={s.id} className="flex-1 flex items-center">
                                <div className="flex flex-col items-center w-full">
                                    <div
                                        className={`
                                            flex items-center justify-center w-9 h-9 rounded-full border text-sm font-semibold
                                            ${isCompleted && "bg-primary text-white border-primary"}
                                            ${isCurrent && "border-primary text-primary"}
                                            ${!isCompleted && !isCurrent && "border-muted text-muted-foreground"}
                                        `}
                                    >
                                        {isCompleted ? <CircleCheck className="w-5 h-5" /> : s.id}
                                    </div>
                                    <span className="mt-2 text-xs font-medium text-center">
                                        {s.label}
                                    </span>
                                </div>
    
                                {index !== steps.length - 1 && (
                                    <div
                                        className={`
                                            flex-1 h-[2px] mx-2
                                            ${step > s.id ? "bg-primary" : "bg-muted"}
                                        `}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        );
    }
}
