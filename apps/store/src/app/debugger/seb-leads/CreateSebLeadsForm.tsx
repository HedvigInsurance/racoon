'use client'

import {useState} from "react";
import {useFormState} from 'react-dom'
import {CrossIconSmall, Text, xStack, yStack} from 'ui'
import {FormResults} from '@/app/debugger/seb-leads/FormResults'
import {SubmitButton} from '@/appComponents/SubmitButton'
import {Combobox} from "@/components/Combobox/Combobox";
import {PersonalNumberField} from '@/components/PersonalNumberField/PersonalNumberField'
import {content, deleteButton} from "@/components/PriceCalculator/MixedBreedPicker/MixedBreedPicker.css";
import {TextField} from '@/components/TextField/TextField'
import {SebDebuggerFormElement} from './constants'
import {createSebLead} from './createSebLead'

const PRODUCT_OPTIONS = [
    {name: 'SE_CAR (carInsurance)', value: 'carInsurance'},
    {name: 'SE_ACCIDENT (accidentInsurance)', value: 'accidentInsurance'},
    {name: 'SE_APARTMENT_BRF (condoInsuranceBrf)', value: 'condoInsuranceBrf'},
    {name: 'SE_APARTMENT_RENT (condoInsuranceRent)', value: 'condoInsuranceRent'},
    {name: 'SE_HOUSE (villaInsurance)', value: 'villaInsurance'},
    {name: 'SE_PET_CAT (catInsurance)', value: 'catInsurance'},
    {name: 'SE_PET_DOG (dogInsurance)', value: 'dogInsurance'},
] as const


export const SebLeadsDebuggerForm = () => {

    const [selectedProducts, setSelectedProducts] = useState<Array<{ name: string, value: string }>>([])

    const handleDelete = (value: string) => () => {
        const newSelectedProducts = selectedProducts.filter((product) => product.value !== value)
        setSelectedProducts(newSelectedProducts)
    }

    const items = PRODUCT_OPTIONS.filter((product) =>
        selectedProducts.every((selectedProduct) =>
            selectedProduct.value !== product.value))

    const [state, formAction] = useFormState(createSebLead, null)

    const handleAdded = (product: any) => {
        console.log('product:', product)
        if (product) {
            setSelectedProducts([...selectedProducts, product])
        }
    }

    return (
        <form action={formAction} className={yStack({gap: 'xs'})}>
            <PersonalNumberField
                label="SSN"
                name={SebDebuggerFormElement.SSN}
                required={true}
                defaultValue={state?.fields?.[SebDebuggerFormElement.SSN]}
            />
            <TextField
                name={SebDebuggerFormElement.FirstName}
                label={SebDebuggerFormElement.FirstName}
                defaultValue={state?.fields?.[SebDebuggerFormElement.FirstName]}
                required={true}
            />
            <TextField
                label={SebDebuggerFormElement.LastName}
                name={SebDebuggerFormElement.LastName}
                required={true}
                defaultValue={state?.fields?.[SebDebuggerFormElement.LastName]}
            />
            <TextField
                label={SebDebuggerFormElement.Email}
                name={SebDebuggerFormElement.Email}
                required={true}
                defaultValue={state?.fields?.[SebDebuggerFormElement.Email]}
            />
            <TextField
                label={SebDebuggerFormElement.PhoneNumber}
                name={SebDebuggerFormElement.PhoneNumber}
                required={true}
                defaultValue={state?.fields?.[SebDebuggerFormElement.PhoneNumber]}
            />
            <div className={content}>

                {selectedProducts.length > 0 && (
                    <>
                        <ul className={yStack({gap: 'xs'})}>
                            {selectedProducts.map((product) => (
                                <li key={product.value} className={xStack({justifyContent: 'space-between'})}>
                                    <Text size="xl">{product.name}</Text>
                                    <button
                                        className={deleteButton}
                                        type="button"
                                        onClick={handleDelete(product.value)}
                                    >
                                        <CrossIconSmall/>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {selectedProducts.map((product) => (
                            <input key={product.value} type="hidden" name={product.name} value={product.value}/>
                        ))}
                    </>
                )}
            </div>
            <Combobox
                items={items}
                displayValue={(product) => product.name as string}
                selectedItem={selectedProducts.map((product) => product.value)}
                onSelectedItemChange={handleAdded}
                placeholder={'Select product'}
                label="Select Products"
                name={SebDebuggerFormElement.Products}
                mutliSelect={true}
            />
            <SubmitButton>Create SEB lead</SubmitButton>
            <FormResults formState={state}/>
        </form>
    )
}
