import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DollarSign, 
  Plus, 
  CheckCircle, 
  Circle,
  RefreshCw,
  Check
} from "lucide-react";
import { useTravelExpenses } from "@/hooks/use-travel-expenses";
import { GroupMember, GroupExpense } from "@/types/travel-group-types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TravelGroupExpensesProps {
  groupId: string;
  groupMembers: GroupMember[];
  currentUserId: string | undefined;
}

const TravelGroupExpenses = ({ 
  groupId, 
  groupMembers,
  currentUserId 
}: TravelGroupExpensesProps) => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [paidByUserId, setPaidByUserId] = useState("");
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom">("equal");
  const [customShares, setCustomShares] = useState<{[userId: string]: string}>({});
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState("🍽️");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { 
    expenses, 
    isLoading, 
    loadExpenses, 
    addExpense, 
    markShareAsPaid 
  } = useTravelExpenses(groupId);
  
  useEffect(() => {
    if (groupId) {
      loadExpenses();
    }
  }, [groupId]);
  
  useEffect(() => {
    if (user?.id) {
      setPaidByUserId(user.id);
    }
  }, [user]);

  const handleAddExpense = async () => {
    if (!expenseTitle || !expenseAmount || !paidByUserId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    let shares: { userId: string; amount: number }[] = [];
    
    if (splitMethod === "equal") {
      const shareAmount = amount / groupMembers.length;
      shares = groupMembers.map(member => ({
        userId: member.user_id,
        amount: Number(shareAmount.toFixed(2))
      }));
    } else {
      let totalShare = 0;
      const customShareEntries = Object.entries(customShares);
      
      for (const [userId, shareAmount] of customShareEntries) {
        const share = parseFloat(shareAmount);
        if (isNaN(share) || share < 0) {
          toast({
            title: "Invalid share amount",
            description: "Please enter valid amounts for all members",
            variant: "destructive",
          });
          return;
        }
        totalShare += share;
      }
      
      if (Math.abs(totalShare - amount) > 0.01) {
        toast({
          title: "Share amounts don't match",
          description: "The sum of all shares must equal the total expense amount",
          variant: "destructive",
        });
        return;
      }
      
      shares = customShareEntries.map(([userId, shareAmount]) => ({
        userId,
        amount: parseFloat(shareAmount)
      }));
    }

    const titleWithCategory = `${selectedCategoryIcon} ${expenseTitle}`;

    const success = await addExpense({
      title: titleWithCategory,
      amount,
      currency,
      paidBy: paidByUserId,
      shares
    });

    if (success) {
      setIsAddExpenseOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setExpenseTitle("");
    setExpenseAmount("");
    setCurrency("INR");
    setPaidByUserId(user?.id || "");
    setSplitMethod("equal");
    setCustomShares({});
    setSelectedCategoryIcon("🍽️");
  };
  
  const handleSplitMethodChange = (method: "equal" | "custom") => {
    setSplitMethod(method);
    
    if (method === "custom") {
      const shares: {[userId: string]: string} = {};
      groupMembers.forEach(member => {
        shares[member.user_id] = "0";
      });
      setCustomShares(shares);
    }
  };
  
  const updateCustomShare = (userId: string, value: string) => {
    setCustomShares(prev => ({
      ...prev,
      [userId]: value
    }));
  };
  
  const handleMarkAsPaid = async (shareId: string, currentStatus: boolean) => {
    await markShareAsPaid(shareId, !currentStatus);
  };

  const getTotalOwed = (userId: string): number => {
    let totalOwed = 0;
    
    expenses.forEach(expense => {
      if (expense.paid_by === userId) return;
      
      const myShare = expense.shares?.find(share => share.user_id === userId);
      
      if (myShare && !myShare.is_paid) {
        totalOwed += myShare.amount;
      }
    });
    
    return totalOwed;
  };
  
  const getTotalLent = (userId: string): number => {
    let totalLent = 0;
    
    expenses.forEach(expense => {
      if (expense.paid_by !== userId) return;
      
      expense.shares?.forEach(share => {
        if (share.user_id !== userId && !share.is_paid) {
          totalLent += share.amount;
        }
      });
    });
    
    return totalLent;
  };
  
  const getBalanceWithMember = (userId: string, otherUserId: string): number => {
    let balance = 0;
    
    expenses.forEach(expense => {
      if (expense.paid_by === userId) {
        const theirShare = expense.shares?.find(share => share.user_id === otherUserId);
        if (theirShare && !theirShare.is_paid) {
          balance += theirShare.amount;
        }
      }
    });
    
    expenses.forEach(expense => {
      if (expense.paid_by === otherUserId) {
        const myShare = expense.shares?.find(share => share.user_id === userId);
        if (myShare && !myShare.is_paid) {
          balance -= myShare.amount;
        }
      }
    });
    
    return balance;
  };

  const categories = [
    { icon: "🍽️" },
    { icon: "🏨" },
    { icon: "🚕" },
    { icon: "🎟️" },
    { icon: "🛍️" },
    { icon: "🧾" }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-trypie-600" />
          <h2 className="text-lg font-medium">Group Expenses</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={loadExpenses}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          
          <Button 
            size="sm"
            onClick={() => setIsAddExpenseOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Expense
          </Button>
        </div>
      </div>
      
      {currentUserId && (
        <div className="p-4 bg-white border-b">
          <h3 className="text-sm font-medium mb-3 text-gray-600">Your Balance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-xs text-red-600 mb-1">You owe</p>
              <p className={`text-xl font-semibold ${getTotalOwed(currentUserId) > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {getCurrencySymbol(currency)} {getTotalOwed(currentUserId).toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-xs text-green-600 mb-1">You are owed</p>
              <p className={`text-xl font-semibold ${getTotalLent(currentUserId) > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                {getCurrencySymbol(currency)} {getTotalLent(currentUserId).toFixed(2)}
              </p>
            </div>
          </div>
          
          {groupMembers.length > 1 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium mb-2 text-gray-600">Balances with others</h3>
              {groupMembers
                .filter(member => member.user_id !== currentUserId)
                .map(member => {
                  const balance = getBalanceWithMember(currentUserId, member.user_id);
                  const isPositive = balance > 0;
                  const isZero = balance === 0;
                  
                  return (
                    <div key={member.user_id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={member.profile?.avatarUrl || undefined} />
                          <AvatarFallback>
                            {member.profile?.fullName?.substring(0, 2) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.profile?.fullName || "User"}</span>
                      </div>
                      <div className={cn(
                        "text-sm font-medium",
                        isPositive ? "text-green-600" : isZero ? "text-gray-500" : "text-red-600"
                      )}>
                        {isPositive ? 'owes you' : isZero ? 'settled up' : 'you owe'}
                        {!isZero && ` ${getCurrencySymbol(currency)} ${Math.abs(balance).toFixed(2)}`}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
      
      <ScrollArea className="flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading expenses...</p>
          </div>
        ) : expenses.length > 0 ? (
          <div className="space-y-4 p-4">
            {expenses.map(expense => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                groupMembers={groupMembers}
                currentUserId={currentUserId}
                onMarkAsPaid={handleMarkAsPaid}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-40">
            <DollarSign className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-gray-500 mb-2">No expenses yet</p>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setIsAddExpenseOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add First Expense
            </Button>
          </div>
        )}
      </ScrollArea>

      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-3">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.icon}
                    type="button"
                    className={cn(
                      "w-12 h-12 flex items-center justify-center rounded-md p-2",
                      selectedCategoryIcon === category.icon 
                        ? "bg-trypie-50 ring-2 ring-trypie-500" 
                        : "bg-gray-100 hover:bg-gray-200"
                    )}
                    onClick={() => setSelectedCategoryIcon(category.icon)}
                  >
                    <span className="text-xl">{category.icon}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expense-title">Expense Name</Label>
              <Input
                id="expense-title"
                placeholder="e.g., Dinner at Restaurant"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Amount</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0.00"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expense-currency">Currency</Label>
                <select
                  id="expense-currency"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paid-by">Paid By</Label>
              <select
                id="paid-by"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                value={paidByUserId}
                onChange={(e) => setPaidByUserId(e.target.value)}
              >
                {groupMembers.map(member => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.profile?.fullName || "User"}
                    {member.user_id === currentUserId ? " (You)" : ""}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Split Method</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={splitMethod === "equal" ? "default" : "outline"}
                  onClick={() => handleSplitMethodChange("equal")}
                  className="flex-1"
                >
                  Split Equally
                </Button>
                <Button
                  type="button" 
                  variant={splitMethod === "custom" ? "default" : "outline"}
                  onClick={() => handleSplitMethodChange("custom")}
                  className="flex-1"
                >
                  Custom Split
                </Button>
              </div>
            </div>
            
            {splitMethod === "custom" && (
              <div className="space-y-2 border p-3 rounded-md">
                <Label className="flex items-center gap-2 mb-2">
                  Custom Shares
                </Label>
                <div className="space-y-3">
                  {groupMembers.map(member => (
                    <div key={member.user_id} className="flex items-center gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.profile?.avatarUrl || undefined} />
                        <AvatarFallback>
                          {member.profile?.fullName?.substring(0, 2) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow text-sm">
                        {member.profile?.fullName || "User"}
                        {member.user_id === currentUserId ? " (You)" : ""}
                      </div>
                      <div className="w-1/3">
                        <div className="flex items-center">
                          <span className="mr-2">{getCurrencySymbol(currency)}</span>
                          <Input
                            type="number"
                            value={customShares[member.user_id] || "0"}
                            onChange={(e) => updateCustomShare(member.user_id, e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {expenseAmount && (
                  <div className="flex justify-between text-sm mt-2 pt-2 border-t">
                    <span>Total:</span>
                    <span>
                      {getCurrencySymbol(currency)} {expenseAmount}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddExpenseOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddExpense}>Save Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function getCurrencySymbol(currency: string): string {
  switch (currency) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    case "INR": return "₹";
    default: return "₹";
  }
}

interface ExpenseCardProps {
  expense: GroupExpense;
  groupMembers: GroupMember[];
  currentUserId?: string;
  onMarkAsPaid: (shareId: string, currentStatus: boolean) => Promise<void>;
}

const ExpenseCard = ({ expense, groupMembers, currentUserId, onMarkAsPaid }: ExpenseCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasEmoji = /^\p{Emoji}/u.test(expense.title);
  const emoji = hasEmoji ? expense.title.match(/^\p{Emoji}/u)?.[0] : null;
  const titleWithoutEmoji = hasEmoji ? expense.title.replace(/^\p{Emoji}/u, "").trim() : expense.title;
  
  const paidByMember = groupMembers.find(m => m.user_id === expense.paid_by);
  const isPaidByCurrentUser = expense.paid_by === currentUserId;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div 
        className="p-4 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            {emoji && (
              <div className="flex-shrink-0 w-10 h-10 bg-trypie-50 rounded-md flex items-center justify-center text-xl">
                {emoji}
              </div>
            )}
            
            <div>
              <h3 className="font-medium">{titleWithoutEmoji}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>Paid by </span>
                <div className="flex items-center ml-1">
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarImage src={paidByMember?.profile?.avatarUrl || expense.paidByProfile?.avatarUrl || undefined} />
                    <AvatarFallback>
                      {paidByMember?.profile?.fullName?.substring(0, 2) || 
                       expense.paidByProfile?.fullName?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>
                    {paidByMember?.profile?.fullName || 
                     expense.paidByProfile?.fullName || "User"}
                    {isPaidByCurrentUser ? " (You)" : ""}
                  </span>
                </div>
                <span className="mx-1">•</span>
                <span>{formatDate(expense.created_at)}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-semibold">
              {getCurrencySymbol(expense.currency)} {expense.amount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      
      {isExpanded && expense.shares && expense.shares.length > 0 && (
        <div className="px-4 pb-4 pt-1 border-t mt-2">
          <h4 className="text-sm font-medium mb-2 text-gray-600">Shares</h4>
          <div className="space-y-2">
            {expense.shares.map(share => {
              const member = groupMembers.find(m => m.user_id === share.user_id);
              const isCurrentUser = share.user_id === currentUserId;
              const isPaid = share.is_paid;
              
              if (share.user_id === expense.paid_by) {
                return null;
              }
              
              return (
                <div 
                  key={share.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md",
                    isPaid ? "bg-green-50" : "bg-gray-50"
                  )}
                >
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={member?.profile?.avatarUrl || undefined} />
                      <AvatarFallback>
                        {member?.profile?.fullName?.substring(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {member?.profile?.fullName || "User"}
                      {isCurrentUser ? " (You)" : ""}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {getCurrencySymbol(expense.currency)} {share.amount.toFixed(2)}
                    </span>
                    
                    {(isCurrentUser || expense.paid_by === currentUserId) && (
                      <button 
                        className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full", 
                          isPaid ? "bg-green-100" : "bg-gray-100 hover:bg-gray-200"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsPaid(share.id, share.is_paid || false);
                        }}
                      >
                        {isPaid ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    )}
                    
                    {isPaid && (
                      <Badge 
                        variant="secondary" 
                        className="bg-green-100 text-green-800 text-xs py-0 h-5"
                      >
                        Paid
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelGroupExpenses;
