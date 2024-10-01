import { cn } from "@/lib/utils";

export function PasswordStrength({ password }: Readonly<{ password: string }>) {
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
                    ? {
                        "bg-red-600": strength === 1,
                        "bg-orange-600": strength === 2,
                        "bg-yellow-600": strength === 3,
                        "bg-green-600": strength === 4,
                        "bg-blue-600": strength === 5,
                      }
                    : "bg-gray-300"
                )}
              />
            );
          })}
      </div>
      <div>
        {strength}/5 ({strengthInWord(strength)})
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

  if (/[a-z]/.exec(password)) {
    strength++;
  }

  if (/[A-Z]/.exec(password)) {
    strength++;
  }

  if (/\d/.exec(password)) {
    strength++;
  }

  if (/[^a-zA-Z0-9]/.exec(password)) {
    strength++;
  }

  return strength;
}

function strengthInWord(strength: number) {
  if (strength === 0) {
    return "very weak";
  } else if (strength === 1) {
    return "weak";
  } else if (strength === 2) {
    return "fair";
  } else if (strength === 3) {
    return "good";
  } else if (strength === 4) {
    return "strong";
  } else if (strength === 5) {
    return "very strong";
  }
}
