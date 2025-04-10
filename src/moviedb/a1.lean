#check Nat → Nat

#check Nat.succ

#check (0,1)

#check (5,9).1

#eval Nat.succ 2

#eval Nat.add 5 9

#check Type 25

#check List

#check Prod

#check fun (α β γ : Type) (g : β → γ) (f : α → β) (x : α) => g (f x)

variable (p q r : Prop)
#check And p q

axiom and_comm (p q : Prop) : (And p q → And q p)

variable (p q:Prop)
#check and_comm p q


variable (a : Type) (r : a → a → Prop)
variable (refl_r : ∀ x, r x x)
variable (symm_r : ∀ {x y}, r x y → r y x)
variable (trans_r : ∀ {x y z},r x y → r y z → r x z)
