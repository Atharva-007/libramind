import React from 'react'

export default function ChallengesPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Challenges</h1>
            <p className="text-sm text-muted-foreground mb-6">A place to host learning challenges, quizzes, and goals.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                    <h3 className="font-semibold">Weekly Reading Challenge</h3>
                    <p className="text-sm">Read 3 documents and write a 200-word reflection.</p>
                </div>
                <div className="p-4 border rounded-md">
                    <h3 className="font-semibold">Summarization Sprint</h3>
                    <p className="text-sm">Upload a PDF and compare AI vs your summary.</p>
                </div>
            </div>
        </div>
    )
}
