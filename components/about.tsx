import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Target, Heart, Lightbulb } from "lucide-react"
import ScrollSlideUp from "./ScrollSlideUp"
import ScrollFadeIn from "./ScrollFadeIn"

const stats = [
  { number: "570K+", label: "Lives Lost Annually", icon: Heart },
  { number: "95%", label: "Preventable Cases", icon: Target },
  { number: "15+", label: "Learning Modules", icon: Lightbulb },
  { number: "10K+", label: "Students Educated", icon: CheckCircle },
]

export default function About() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="about">
      <div className="container !px-1 mx-auto max-w-4xl">
        <div className="grid gap-16 items-center">
          <div className="space-y-8">
            <ScrollFadeIn>
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  C3 Initiative: Making Cervical Cancer{" "}
                  <span className="bg-gradient-to-r from-orange-500 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                    Prevention Accessible
                  </span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  The C3 Initiative addresses the critical gap in cervical cancer education. Despite being one of the most
                  preventable cancers, cervical cancer remains a leading cause of cancer-related deaths among women
                  worldwide. Our mission is to bridge this knowledge gap with comprehensive, accessible education.
                </p>
              </div>
            </ScrollFadeIn>

            <div className="space-y-4">
              <ScrollSlideUp>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Evidence-Based Content</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      All our modules are based on the latest medical research and guidelines from WHO and CDC.
                    </p>
                  </div>
                </div>
              </ScrollSlideUp>
              <ScrollSlideUp>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Interactive Learning</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Engage with multimedia content, quizzes, and case studies for better retention.
                    </p>
                  </div>
                </div>
              </ScrollSlideUp>
              <ScrollSlideUp>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Cultural Sensitivity</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Content adapted to address cultural barriers and promote inclusive health education.
                    </p>
                  </div>
                </div>
              </ScrollSlideUp>
            </div>
          </div>

          {/* <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover-shadow-gradient group cursor-pointer">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 gradient-orange-blue rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  )
}
