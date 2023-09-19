import Image from 'next/image';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="bg-gray-900">
      <Image src={'/walkdi.svg'} alt="Loading" width={100} height={100} />
    </div>
  );
}
