import Image from "next/image";

interface Props {
    src?: string;
    alt: string;
    className?: React.HTMLAttributes<HTMLImageElement>['className'];
    width: number;
    height: number;
}

export const ProductImage = ({ src, alt, className, width, height }: Props) => {
    return (
        <Image
            src={src || '/imgs/placeholder.webp'}
            width={width}
            height={height}
            alt={alt}
            className={className}
        />
    )
}
