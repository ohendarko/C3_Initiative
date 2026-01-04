
import SlideInFromLeft from "./SlideInFromLeft"
import Image from 'next/image'


export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700" id="features">
      <div className="container !px-1 mx-auto max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-7">
            Why Choose C3 Initiative?
          </h2>
          <div className='grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2'>
            <SlideInFromLeft>
              <div className='relative w-full h-96'>
                <Image
                  src="/images/choose.jpg"
                  alt="core value"
                  className="object-cover rounded-sm"
                  fill
                />
              </div>
            </SlideInFromLeft>
            <div className='flex justify-center items-center'>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 text-left">
                Cervical cancer remains a leading cause of cancer-related deaths among women in Ghana, partly due to the lack of knowledge and awareness. Our mission is to bridge the knowledge gap with comprehensive and accessible education. The C3 eLearning platform combines cutting-edge technology, with medical expertise to deliver evidence-based information on cervical cancer risk factors, signs and symptoms, HPV vaccination, screening, diagnosis, treatment and palliative.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
