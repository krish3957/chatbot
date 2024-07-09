import { LoaderIcon } from "lucide-react"
import { Button, ButtonProps } from "./button"

type LoadingButtonProps = {
    loading: boolean,
} & ButtonProps

const LoadingButton = ({
    children,
    loading,
    ...props
}: LoadingButtonProps) => {
    return (
        <Button disabled={props.disabled || loading}>
            {loading && <LoaderIcon className="animate-spin" />}
            {children}
        </Button>
    )
}

export default LoadingButton