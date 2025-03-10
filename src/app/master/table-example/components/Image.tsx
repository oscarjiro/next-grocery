import Image from 'next/image'

interface ImgProps {
  src: string
  alt: string
  width?: number
  height?: number
}

const Img = ({ src, alt, width = 50, height = 50 }: ImgProps) => {
  return <Image src={src} alt={alt} width={width} height={height} className='object-cover rounded-md' />
}

export default Img
