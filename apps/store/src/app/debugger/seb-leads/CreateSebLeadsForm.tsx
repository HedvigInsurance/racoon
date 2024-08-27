'use client'
import {useFormState} from "react-dom";
import {Space, Text} from "ui";
import {createSebLead} from "@/app/debugger/seb-leads/actions";
import {SEBFormElement} from "@/app/debugger/seb-leads/types";
import {SubmitButton} from "@/appComponents/SubmitButton";
import {ErrorMessages} from "@/components/FormErrors/ErrorMessages";
import {InputSelect} from "@/components/InputSelect/InputSelect";
import {PersonalNumberField} from "@/components/PersonalNumberField/PersonalNumberField";
import {TextField} from "@/components/TextField/TextField";

const PRODUCT_OPTIONS = [
    { name: 'SE_CAR', value: 'carInsurance' },
    { name: 'SE_ACCIDENT', value: 'accidentInsurance' },
    { name: 'SE_APARTMENT_BRF', value: 'condoInsuranceBrf' },
    { name: 'SE_APARTMENT_RENT', value: 'condoInsuranceRent' },
    { name: 'SE_HOUSE', value: 'villaInsurance' },
    { name: 'SE_PET_CAT', value: 'catInsurance' },
    { name: 'SE_PET_DOG', value: 'dogInsurance' },

]

export const SebLeadsDebuggerForm = () => {
    const [state, formAction] = useFormState(createSebLead, {
        fields: {
            SSN: '199801011234',
            firstName: 'John',
            lastName: 'Doe',
            email: 'John.Doe@gmail.com',
            phoneNumber: '+46707070707',
            product: PRODUCT_OPTIONS[2].value,
        },
    })


    return (
        <>
            <form action={formAction}>
                <Space y={0.25}>
                    <PersonalNumberField
                        label="SSN (YYMMDD-XXXX)"
                        required={true}
                        defaultValue={state?.fields?.[SEBFormElement.SSN]}
                    />
                    <TextField
                        type="text"
                        label="FirstName"
                        defaultValue={state?.fields?.[SEBFormElement.FirstName]}
                        required={true}
                    />
                    <TextField
                        type="text"
                        label={SEBFormElement.LastName}
                        required={true}
                        defaultValue={state?.fields?.[SEBFormElement.LastName]}
                    />
                    <TextField
                        type="text"
                        label={SEBFormElement.Email}
                        required={true}
                        defaultValue={state?.fields?.[SEBFormElement.Email]}
                    />
                    <TextField
                        type="text"
                        label={SEBFormElement.PhoneNumber}
                        required={true}
                        defaultValue={state?.fields?.[SEBFormElement.PhoneNumber]}
                    />
                    {/*
                        Would like to show both name and value for easier use,
                        and be able to select multiple values to be pushed to an array
                    */}
                    <InputSelect
                        name={SEBFormElement.Product}
                        required={true}
                        defaultValue={state?.fields?.[SEBFormElement.Product]}
                        options={PRODUCT_OPTIONS}
                    />
                    <Space y={0.5}>
                        <SubmitButton>Create SEB lead</SubmitButton>
                        <Text as="p" size="xs" align="center" color="textSecondary">
                            This is an internal tool
                        </Text>
                    </Space>
                </Space>
            </form>
            <ErrorMessages errors={state?.errors?.generic} />
        </>
    )
}