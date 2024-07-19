import { useGameProvider } from "@/lib/Provider";
import { Field, Label, Switch } from '@headlessui/react';

export default function AdminButton() {
    const {admin, toggleAdmin} = useGameProvider();

    return (
        <div className="fixed bottom-0 right-0 flex flex-col mt-4 z-30">
        <Field>
        <Label>{admin ? "ADMIN ON " : "ADMIN OFF"}</Label>
            <Switch
            checked={admin}
            onChange={() => toggleAdmin()}
            className="group inline-flex h-6 w-11 items-center rounded-full bg-lime-100 transition data-[checked]:bg-lime-500"
            >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
            </Switch>
        </Field>
    
    </div>
    )
}

