export default function VerticalText({ text = "GAME STANDING" }) {
    return (
      <div className="flex flex-col justify-around items-center text-[15px]  font-[683] p-3 text-white leading-tight whitespace-pre "   style={{
        background: "linear-gradient(180deg, #1c1f2b 0%, #2a2f3f 26.05%, #3a3f50 100%)",
      }}
    >
        {text.split("").map((char, index) => (
          <span key={index}>{char === " " ? "\u00A0" : char}</span>
        ))}
      </div>
    );
  }