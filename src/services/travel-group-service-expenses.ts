
import { supabase } from "@/integrations/supabase/client";
import { GroupExpense, ExpenseShare } from "@/types/travel-group-types";
import { Profile } from "@/types/auth-types";

// Helper function to map Supabase profile data to our Profile type
const mapProfile = (profile: any): Profile | undefined => {
  if (!profile) return undefined;
  return {
    id: profile.id,
    fullName: profile.full_name || null,
    avatarUrl: profile.avatar_url || null,
    email: profile.email || "", // Handle case where email might not be available
    createdAt: profile.created_at || new Date().toISOString(),
    bio: profile.bio || null,
    interests: profile.interests || null,
    websiteUrl: profile.website_url || null,
    instagramHandle: profile.instagram_handle || null,
    twitterHandle: profile.twitter_handle || null
  };
};

export async function fetchGroupExpenses(groupId: string): Promise<GroupExpense[]> {
  if (groupId.startsWith('sample-')) {
    // Return sample expenses for demo groups
    return [
      {
        id: 'sample-expense-1',
        group_id: groupId,
        title: 'Hotel Stay',
        amount: 500,
        currency: 'USD',
        paid_by: 'sample-user-1',
        created_at: new Date().toISOString(),
        paidByProfile: {
          id: 'sample-user-1',
          fullName: 'Alex Johnson',
          avatarUrl: 'https://i.pravatar.cc/150?u=sample1',
          email: 'alex@example.com',
          createdAt: new Date().toISOString()
        },
        shares: [
          {
            id: 'sample-share-1',
            expense_id: 'sample-expense-1',
            user_id: 'sample-user-1',
            amount: 250,
            is_paid: true
          },
          {
            id: 'sample-share-2',
            expense_id: 'sample-expense-1',
            user_id: 'sample-user-2',
            amount: 250,
            is_paid: false
          }
        ]
      },
      {
        id: 'sample-expense-2',
        group_id: groupId,
        title: 'Dinner',
        amount: 120,
        currency: 'USD',
        paid_by: 'sample-user-2',
        created_at: new Date().toISOString(),
        paidByProfile: {
          id: 'sample-user-2',
          fullName: 'Sam Smith',
          avatarUrl: 'https://i.pravatar.cc/150?u=sample2',
          email: 'sam@example.com',
          createdAt: new Date().toISOString()
        },
        shares: [
          {
            id: 'sample-share-3',
            expense_id: 'sample-expense-2',
            user_id: 'sample-user-1',
            amount: 60,
            is_paid: false
          },
          {
            id: 'sample-share-4',
            expense_id: 'sample-expense-2',
            user_id: 'sample-user-2',
            amount: 60,
            is_paid: true
          }
        ]
      }
    ];
  }
  
  // Fetch all expenses for the group with payer profiles using the new foreign key
  const { data: expensesData, error: expensesError } = await supabase
    .from('group_expenses')
    .select(`
      *,
      payer:profiles!group_expenses_paid_by_fkey(id, full_name, avatar_url, created_at, bio, interests, website_url, instagram_handle, twitter_handle)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  if (expensesError) {
    console.error("Error fetching group expenses:", expensesError);
    throw expensesError;
  }

  // Fetch all expense shares for each expense with user profiles
  const expensesWithDetails = await Promise.all(expensesData.map(async (expense) => {
    const { data: sharesData, error: sharesError } = await supabase
      .from('expense_shares')
      .select(`
        *,
        user:profiles!expense_shares_user_id_fkey(id, full_name, avatar_url, created_at, bio, interests, website_url, instagram_handle, twitter_handle)
      `)
      .eq('expense_id', expense.id);
    
    if (sharesError) {
      console.error("Error fetching expense shares:", sharesError);
      throw sharesError;
    }

    return {
      id: expense.id,
      group_id: expense.group_id,
      title: expense.title,
      amount: expense.amount,
      currency: expense.currency,
      paid_by: expense.paid_by,
      created_at: expense.created_at,
      paidByProfile: expense.payer ? mapProfile(expense.payer) : undefined,
      shares: sharesData.map(share => ({
        id: share.id,
        expense_id: share.expense_id,
        user_id: share.user_id,
        amount: share.amount,
        is_paid: share.is_paid,
        user: share.user ? mapProfile(share.user) : undefined
      })) as ExpenseShare[]
    } as GroupExpense;
  }));

  return expensesWithDetails;
}

export async function createExpense(expenseData: {
  group_id: string;
  title: string;
  amount: number;
  currency: string;
  paid_by: string;
  shares: { userId: string; amount: number }[];
}): Promise<GroupExpense> {
  if (expenseData.group_id.startsWith('sample-')) {
    return {
      id: `sample-expense-${Date.now()}`,
      group_id: expenseData.group_id,
      title: expenseData.title,
      amount: expenseData.amount,
      currency: expenseData.currency,
      paid_by: expenseData.paid_by,
      created_at: new Date().toISOString()
    } as GroupExpense;
  }
  
  // First, create the expense
  const { data: expenseData2, error: expenseError } = await supabase
    .from('group_expenses')
    .insert({
      group_id: expenseData.group_id,
      title: expenseData.title,
      amount: expenseData.amount,
      currency: expenseData.currency,
      paid_by: expenseData.paid_by
    })
    .select()
    .single();

  if (expenseError) {
    console.error("Error creating expense:", expenseError);
    throw expenseError;
  }

  // Then, create all expense shares
  const shareInserts = expenseData.shares.map(share => ({
    expense_id: expenseData2.id,
    user_id: share.userId,
    amount: share.amount,
    is_paid: false
  }));

  const { data: sharesData, error: sharesError } = await supabase
    .from('expense_shares')
    .insert(shareInserts)
    .select();

  if (sharesError) {
    console.error("Error creating expense shares:", sharesError);
    throw sharesError;
  }

  // Get the payer's profile using the foreign key relationship
  const { data: payerData, error: payerError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, created_at, bio, interests, website_url, instagram_handle, twitter_handle')
    .eq('id', expenseData.paid_by)
    .maybeSingle();
    
  if (payerError) {
    console.error("Error fetching payer profile:", payerError);
  }

  return {
    ...expenseData2,
    paidByProfile: payerData ? mapProfile(payerData) : undefined,
    shares: sharesData as ExpenseShare[]
  } as GroupExpense;
}

export async function updateExpenseShare(shareId: string, isPaid: boolean): Promise<ExpenseShare> {
  if (shareId.startsWith('sample-')) {
    return {
      id: shareId,
      expense_id: 'sample-expense',
      user_id: 'sample-user',
      amount: 100,
      is_paid: isPaid
    } as ExpenseShare;
  }
  
  const { data, error } = await supabase
    .from('expense_shares')
    .update({ is_paid: isPaid })
    .eq('id', shareId)
    .select()
    .single();

  if (error) {
    console.error("Error updating expense share:", error);
    throw error;
  }

  return data as ExpenseShare;
}

// Adding the missing functions that were imported but not exported
export async function updateExpense(expenseId: string, updates: Partial<GroupExpense>): Promise<GroupExpense> {
  if (expenseId.startsWith('sample-')) {
    return {
      id: expenseId,
      group_id: 'sample-group',
      title: updates.title || 'Sample Expense',
      amount: updates.amount || 100,
      currency: updates.currency || 'USD',
      paid_by: updates.paid_by || 'sample-user',
      created_at: new Date().toISOString()
    } as GroupExpense;
  }
  
  const { data, error } = await supabase
    .from('group_expenses')
    .update(updates)
    .eq('id', expenseId)
    .select()
    .single();

  if (error) {
    console.error("Error updating expense:", error);
    throw error;
  }

  return data as GroupExpense;
}

export async function deleteExpense(expenseId: string): Promise<boolean> {
  if (expenseId.startsWith('sample-')) {
    return true;
  }
  
  const { error } = await supabase
    .from('group_expenses')
    .delete()
    .eq('id', expenseId);

  if (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }

  return true;
}

export async function fetchExpenseShares(expenseId: string): Promise<ExpenseShare[]> {
  if (expenseId.startsWith('sample-')) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('expense_shares')
    .select('*')
    .eq('expense_id', expenseId);

  if (error) {
    console.error("Error fetching expense shares:", error);
    throw error;
  }

  return data as ExpenseShare[];
}

export async function createExpenseShare(expenseShare: {
  expense_id: string;
  user_id: string;
  amount: number;
  is_paid?: boolean;
}): Promise<ExpenseShare> {
  if (expenseShare.expense_id.startsWith('sample-')) {
    return {
      id: `sample-share-${Date.now()}`,
      expense_id: expenseShare.expense_id,
      user_id: expenseShare.user_id,
      amount: expenseShare.amount,
      is_paid: expenseShare.is_paid || false
    } as ExpenseShare;
  }
  
  const { data, error } = await supabase
    .from('expense_shares')
    .insert(expenseShare)
    .select()
    .single();

  if (error) {
    console.error("Error creating expense share:", error);
    throw error;
  }

  return data as ExpenseShare;
}

export async function deleteExpenseShare(shareId: string): Promise<boolean> {
  if (shareId.startsWith('sample-')) {
    return true;
  }
  
  const { error } = await supabase
    .from('expense_shares')
    .delete()
    .eq('id', shareId);

  if (error) {
    console.error("Error deleting expense share:", error);
    throw error;
  }

  return true;
}
