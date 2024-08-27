import {Heading, Space, sprinkles} from "ui";
import {SebLeadsDebuggerForm} from "@/app/debugger/seb-leads/CreateSebLeadsForm";
import * as GridLayout from "@/components/GridLayout/GridLayout";

function SebLeadsDebuggerPage() {
    return (
        <Space>
            <GridLayout.Root>
                <GridLayout.Content width="1/3" align="center">
                    <Space y={2}>
                        <Heading className={sprinkles({ mt: 'xl' })} as="h1" align="center" balance={true}>
                            Create SEB Leads
                        </Heading>
                        <SebLeadsDebuggerForm />
                    </Space>
                </GridLayout.Content>
            </GridLayout.Root>
        </Space>
    )
}

export default SebLeadsDebuggerPage

export const metadata = {
    robots: 'noindex, nofollow',
}
