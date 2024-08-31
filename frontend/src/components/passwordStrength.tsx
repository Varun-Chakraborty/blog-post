import { cn } from "@/lib/utils";

export function PasswordStrength({ password }: { password: string }) {
  const strength = calculateStrength(password);
  return (
    <div className="flex items-center justify-between gap-2 text-sm text-gray-600 dark:text-slate-400">
      <div className="flex gap-1">
        {Array(5)
          .fill(0)
          .map((_, i) => {
            return (
              <div
                key={i}
                className={cn(
                  "w-6 h-2 rounded-full mr-1",
                  strength > i
                    ? strength === 1
                      ? "bg-red-600"
                      : strength === 2
                      ? "bg-orange-600"
                      : strength === 3
                      ? "bg-yellow-600"
                      : strength === 4
                      ? "bg-green-600"
                      : "bg-blue-600"
                    : "bg-gray-300"
                )}
              />
            );
          })}
      </div>
      <div>
        {strength}/5 (
        {strength === 0
          ? "very weak"
          : strength === 1
          ? "weak"
          : strength === 2
          ? "fair"
          : strength === 3
          ? "good"
          : strength === 4
          ? "strong"
          : strength === 5 && "very strong"}
        )
      </div>
    </div>
  );
}

function calculateStrength(password: string) {
  let strength = 0;

  password = password.trim();

  if (password.length < 8 && password.length > 0) {
    return 1;
  } else if (password.length >= 8) strength++;

  if (password.match(/[a-z]/)) {
    strength++;
  }

  if (password.match(/[A-Z]/)) {
    strength++;
  }

  if (password.match(/[0-9]/)) {
    strength++;
  }

  if (password.match(/[^a-zA-Z0-9]/)) {
    strength++;
  }

  return strength;
}
