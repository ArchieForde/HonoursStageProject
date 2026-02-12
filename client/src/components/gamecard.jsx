import { Star } from "lucide-react"

export default function gameCard({ game }) {
    return (
        <div className="bg-purple-800/40 backdrop-blur-sm rounded-x1 border border-purple-700/40 shadow-x1 p-6 transistion-all duration-300 hover:border-purple-500/70 hover:shadow-purple-500/20">

            <img
                src={game.image}
                alt= {game.name}
            className = "rounded-lg mb-4 w-full h-64 object-cover"
            />

            <h2 className= "text-2xl font-semibold mb-2">
                {game.name}
            </h2>

            <div className = "flex items-center gap-2 text-purple-300">
                <Star size={18} />
                <span>{game.rating}</span>
            </div>
        
            
        </div>
    )
}