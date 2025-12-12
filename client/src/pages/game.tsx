import { useState, useEffect } from 'react';
import { Heart, Home, Briefcase, Sparkles, TrendingUp } from 'lucide-react';

interface GameStateType {
  money: number;
  health: number;
  dayCount: number;
  totalEarned: number;
  salary: { timeLeft: number; unlocked: boolean };
  skill: { purchased: boolean; cost: number; income: number; boostLevel: number; boostCount: number; lastBoostTime: number };
  miniBusiness: { purchased: boolean; cost: number; income: number; boostLevel: number; boostCount: number; lastBoostTime: number };
  investment: { totalInvested: number; returns: number; timeLeft: number; countdownMonths: number };
  jobQuit: boolean;
  lifestylePurchases: LifestylePurchase[];
  expensesDebited: boolean;
  showExpenseBreakdown: boolean;
  expenseGlow: boolean;
  lastDeductedAmount: number;
  expenseDebitTime?: number;
  showHealthBoostModal: boolean;
  showBoostModal: boolean;
  showBusinessBoostModal: boolean;
  showBusinessLockedModal: boolean;
  showBusinessUnlockedNotification: boolean;
  businessUnlockedTime: number;
  goodSleepLastUsed: number;
  goodSleepCountdown: number;
  dailyRewardStreak: number;
  lastDailyRewardDate: string | null;
  showDailyRewardModal: boolean;
  dailyRewardGlow: boolean;
  achievements: string[];
  showAchievementNotification: boolean;
  achievementAmount: number;
  achievementNotificationTime: number;
  gameOver: boolean;
  finalStats: FinalStats | null;
  gamePaused: boolean;
  healthBoostCostMultiplier: number;
  showBannerAd: boolean;
  bannerAdLastShown: number;
  bannerAdShownTime: number | null;
  showInsufficientFundsModal: boolean;
  insufficientFundsMessage: string;
  showReversalNotification: boolean;
  reversedItems: LifestylePurchase[];
  reversalTime: number;
  showHealthWarning?: boolean;
  tasksCompleted: { facebook: boolean; screenshot: boolean };
  showAllAchievementsComplete: boolean;
  allAchievementsShown: boolean;
  showGameWon: boolean;
}

interface LifestylePurchase {
  id: string;
  name: string;
  category: string;
  price: number;
  maintenance: number;
  isRent?: boolean;
  image?: string;
}

interface FinalStats {
  monthsSurvived: number;
  finalBalance: number;
  totalEarned: number;
  achievementsUnlocked: number;
  maxHealth: number;
  finalHealth: number;
}

interface LifestyleItem {
  id: string;
  name: string;
  price: number;
  image: string;
  maintenance: number;
  isRent?: boolean;
  duration?: string;
}

const STORAGE_KEY = 'naija_wealth_sim_save';

const getDefaultGameState = (): GameStateType => ({
  money: 0,
  health: 100,
  dayCount: 0,
  totalEarned: 0,
  salary: { timeLeft: 60, unlocked: true },
  skill: { purchased: false, cost: 150000, income: 20000, boostLevel: 0, boostCount: 0, lastBoostTime: -20 },
  miniBusiness: { purchased: false, cost: 500000, income: 65000, boostLevel: 0, boostCount: 0, lastBoostTime: -20 },
  investment: { totalInvested: 0, returns: 0, timeLeft: 0, countdownMonths: 0 },
  jobQuit: false,
  lifestylePurchases: [],
  expensesDebited: false,
  showExpenseBreakdown: false,
  expenseGlow: false,
  lastDeductedAmount: 0,
  showHealthBoostModal: false,
  showBoostModal: false,
  showBusinessBoostModal: false,
  showBusinessLockedModal: false,
  showBusinessUnlockedNotification: false,
  businessUnlockedTime: 0,
  goodSleepLastUsed: -300,
  goodSleepCountdown: 0,
  dailyRewardStreak: 0,
  lastDailyRewardDate: null,
  showDailyRewardModal: false,
  dailyRewardGlow: true,
  achievements: [],
  showAchievementNotification: false,
  achievementAmount: 0,
  achievementNotificationTime: 0,
  gameOver: false,
  finalStats: null,
  gamePaused: false,
  healthBoostCostMultiplier: 1,
  showBannerAd: false,
  bannerAdLastShown: -90,
  bannerAdShownTime: null,
  showInsufficientFundsModal: false,
  insufficientFundsMessage: '',
  showReversalNotification: false,
  reversedItems: [],
  reversalTime: 0,
  tasksCompleted: { facebook: false, screenshot: false },
  showAllAchievementsComplete: false,
  allAchievementsShown: false,
  showGameWon: false
});

const loadSavedGame = (): { gameState: GameStateType; gameTime: number } | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.gameState && typeof parsed.gameTime === 'number') {
        const defaultState = getDefaultGameState();
        const loadedState: GameStateType = {
          ...defaultState,
          ...parsed.gameState,
          showExpenseBreakdown: false,
          showHealthBoostModal: false,
          showBoostModal: false,
          showBusinessBoostModal: false,
          showBusinessLockedModal: false,
          showBusinessUnlockedNotification: false,
          showDailyRewardModal: false,
          showAchievementNotification: false,
          showBannerAd: false,
          showInsufficientFundsModal: false,
          showReversalNotification: false,
          showAllAchievementsComplete: false,
          showGameWon: false,
          goodSleepCountdown: 0,
          insufficientFundsMessage: '',
          reversedItems: [],
          gamePaused: false
        };
        return { gameState: loadedState, gameTime: parsed.gameTime };
      }
    }
  } catch (e) {
    console.error('Failed to load saved game:', e);
  }
  return null;
};

const saveGame = (gameState: GameStateType, gameTime: number) => {
  try {
    const saveData = {
      gameState: {
        money: gameState.money,
        health: gameState.health,
        dayCount: gameState.dayCount,
        totalEarned: gameState.totalEarned,
        salary: gameState.salary,
        skill: gameState.skill,
        miniBusiness: gameState.miniBusiness,
        investment: gameState.investment,
        jobQuit: gameState.jobQuit,
        lifestylePurchases: gameState.lifestylePurchases,
        expensesDebited: gameState.expensesDebited,
        lastDeductedAmount: gameState.lastDeductedAmount,
        goodSleepLastUsed: gameState.goodSleepLastUsed,
        dailyRewardStreak: gameState.dailyRewardStreak,
        lastDailyRewardDate: gameState.lastDailyRewardDate,
        achievements: gameState.achievements,
        gameOver: gameState.gameOver,
        finalStats: gameState.finalStats,
        healthBoostCostMultiplier: gameState.healthBoostCostMultiplier,
        bannerAdLastShown: gameState.bannerAdLastShown,
        tasksCompleted: gameState.tasksCompleted,
        allAchievementsShown: gameState.allAchievementsShown,
        businessUnlockedTime: gameState.businessUnlockedTime,
        achievementNotificationTime: gameState.achievementNotificationTime,
        reversalTime: gameState.reversalTime
      },
      gameTime,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.error('Failed to save game:', e);
  }
};

export default function MoneyGameSim() {
  const savedGame = loadSavedGame();
  
  const [gameState, setGameState] = useState<GameStateType>(
    savedGame?.gameState || getDefaultGameState()
  );

  const [currentPage, setCurrentPage] = useState('home');
  const [activeCategory, setActiveCategory] = useState('home');
  const [gameTime, setGameTime] = useState(savedGame?.gameTime || 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(t => {
        const newTime = t + 1;
        
        setGameState(prev => {
          if (prev.gamePaused || prev.gameOver) return prev;
          
          const newState = { ...prev };
          
          if (newState.salary.timeLeft > 0) {
            newState.salary = { ...prev.salary, timeLeft: prev.salary.timeLeft - 1 };
            
            if (newState.salary.timeLeft === 0) {
              let salaryIncome = prev.jobQuit ? 0 : 50000;
              let skillIncome = prev.skill.purchased ? prev.skill.income : 0;
              let businessIncome = prev.miniBusiness.purchased ? prev.miniBusiness.income : 0;
              let totalIncome = salaryIncome + skillIncome + businessIncome;
              
              const maintenanceCosts = prev.lifestylePurchases.reduce((total, purchase) => total + (purchase.maintenance || 0), 0);
              let currentBalance = prev.money + totalIncome;
              
              let itemsReversed: LifestylePurchase[] = [];
              let finalPurchases = [...prev.lifestylePurchases];
              
              if (currentBalance < maintenanceCosts) {
                const itemsWithMaintenance = prev.lifestylePurchases
                  .filter(p => p.maintenance > 0)
                  .sort((a, b) => b.price - a.price);
                
                for (const item of itemsWithMaintenance) {
                  currentBalance += item.price;
                  itemsReversed.push(item);
                  finalPurchases = finalPurchases.filter(p => p.id !== item.id);
                  const newMaintenanceCost = finalPurchases.reduce((total, p) => total + (p.maintenance || 0), 0);
                  if (currentBalance >= newMaintenanceCost) break;
                }
                
                if (itemsReversed.length > 0) {
                  newState.showReversalNotification = true;
                  newState.reversedItems = itemsReversed;
                  newState.reversalTime = newTime;
                }
              }
              
              const finalMaintenanceCost = finalPurchases.reduce((total, p) => total + (p.maintenance || 0), 0);
              currentBalance = currentBalance - finalMaintenanceCost;
              
              newState.money = currentBalance;
              newState.lifestylePurchases = finalPurchases;
              newState.totalEarned = prev.totalEarned + totalIncome;
              
              if (finalMaintenanceCost > 0) {
                newState.expensesDebited = true;
                newState.expenseGlow = true;
                newState.expenseDebitTime = newTime;
                newState.lastDeductedAmount = finalMaintenanceCost;
              }
              
              const newHealth = Math.max(0, prev.health - 5);
              newState.showHealthWarning = newHealth <= 60;
              newState.health = newHealth;
              newState.dayCount = prev.dayCount + 1;
              
              if (newHealth <= 50) {
                newState.gameOver = true;
                newState.finalStats = {
                  monthsSurvived: newState.dayCount,
                  finalBalance: newState.money,
                  totalEarned: newState.totalEarned,
                  achievementsUnlocked: newState.achievements.length,
                  maxHealth: 100,
                  finalHealth: newHealth
                };
                return newState;
              }
              newState.salary = { ...newState.salary, timeLeft: 60 };
              
              if (prev.investment.countdownMonths > 0) {
                newState.investment = { ...prev.investment, countdownMonths: prev.investment.countdownMonths - 1 };
                if (newState.investment.countdownMonths === 0) {
                  const totalReturn = prev.investment.totalInvested + prev.investment.returns;
                  newState.money = newState.money + totalReturn;
                  newState.investment = { totalInvested: 0, returns: 0, timeLeft: 0, countdownMonths: 0 };
                }
              }
            }
          }
          
          if (newState.expensesDebited && newState.expenseDebitTime && newTime - newState.expenseDebitTime >= 15) {
            newState.expensesDebited = false;
            newState.expenseGlow = false;
          }
          
          if (newState.showBusinessUnlockedNotification && newTime - newState.businessUnlockedTime >= 5) {
            newState.showBusinessUnlockedNotification = false;
          }
          
          if (prev.goodSleepCountdown > 0) {
            newState.goodSleepCountdown = prev.goodSleepCountdown - 1;
            if (newState.goodSleepCountdown === 0) {
              const healthBoost = Math.min(100, prev.health + 25);
              newState.health = healthBoost;
              newState.goodSleepLastUsed = newTime;
              newState.healthBoostCostMultiplier = prev.healthBoostCostMultiplier * 1.2;
              newState.showHealthWarning = healthBoost <= 60;
            }
          }
          
          const timeSinceLastBanner = newTime - prev.bannerAdLastShown;
          if (timeSinceLastBanner >= 90 && !prev.showBannerAd && prev.goodSleepCountdown === 0) {
            newState.showBannerAd = true;
            newState.bannerAdLastShown = newTime;
            newState.bannerAdShownTime = newTime;
          }
          
          if (prev.showBannerAd && prev.bannerAdShownTime && newTime - prev.bannerAdShownTime >= 6) {
            newState.showBannerAd = false;
          }
          
          return newState;
        });
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Check for all achievements complete and game won
  useEffect(() => {
    const allItemIds = [
      'bungalow', 'duplex', 'mansion', 'penthouse',
      'toyota', 'lexus', 'bmw', 'mercedes', 'bentley',
      'speedboat', 'yacht_small', 'yacht_luxury', 'mega_yacht',
      'light_jet', 'midsize_jet', 'heavy_jet', 'airliner'
    ];
    
    const allAchievementsComplete = gameState.achievements.length >= 8;
    const allItemsOwned = allItemIds.every(id => 
      gameState.lifestylePurchases.some(p => p.id === id)
    );
    
    // Show all achievements complete modal (only once)
    if (allAchievementsComplete && !gameState.allAchievementsShown && !gameState.showGameWon) {
      setGameState(prev => ({
        ...prev,
        showAllAchievementsComplete: true,
        allAchievementsShown: true
      }));
    }
    
    // Show game won screen when both conditions are met
    if (allAchievementsComplete && allItemsOwned && !gameState.showGameWon) {
      setGameState(prev => ({
        ...prev,
        showGameWon: true,
        showAllAchievementsComplete: false,
        gamePaused: true
      }));
    }
  }, [gameState.achievements.length, gameState.lifestylePurchases.length, gameState.allAchievementsShown, gameState.showGameWon]);

  // Auto-save game progress to localStorage
  useEffect(() => {
    // Don't save if game is over or won
    if (!gameState.gameOver && !gameState.showGameWon) {
      saveGame(gameState, gameTime);
    }
  }, [gameState, gameTime]);

  const formatCurrency = (amount: number) => {
    return '₦' + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const formatGameTime = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${months} months`;
    if (years === 1 && remainingMonths === 0) return '1 year';
    if (years === 1) return `1 year & ${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} years`;
    return `${years} years & ${remainingMonths} months`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const ALL_LIFESTYLE_ITEM_IDS = [
    'bungalow', 'duplex', 'mansion', 'penthouse',
    'toyota', 'lexus', 'bmw', 'mercedes', 'bentley',
    'speedboat', 'yacht_small', 'yacht_luxury', 'mega_yacht',
    'light_jet', 'midsize_jet', 'heavy_jet', 'airliner'
  ];
  
  const TOTAL_ACHIEVEMENTS = 8;
  
  const hasAllAchievements = gameState.achievements.length >= TOTAL_ACHIEVEMENTS;
  const hasAllItems = ALL_LIFESTYLE_ITEM_IDS.every(id => 
    gameState.lifestylePurchases.some(p => p.id === id)
  );
  const hasWonGame = hasAllAchievements && hasAllItems;

  const calculateMaintenanceCosts = () => {
    return gameState.lifestylePurchases.reduce((total, purchase) => total + (purchase.maintenance || 0), 0);
  };

  const totalMaintenance = calculateMaintenanceCosts();

  const toggleExpenseBreakdown = () => {
    setGameState(prev => ({
      ...prev,
      showExpenseBreakdown: !prev.showExpenseBreakdown,
      expenseGlow: false
    }));
  };

  const handleHealthBoost = (type: 'food' | 'exercise' | 'checkup') => {
    const baseCosts = { food: 25000, exercise: 50000, checkup: 100000 };
    const basePoints = { food: 3, exercise: 5, checkup: 10 };
    const actualCost = Math.floor(baseCosts[type] * gameState.healthBoostCostMultiplier);
    const points = basePoints[type];
    
    if (gameState.money >= actualCost) {
      const newHealth = Math.min(100, gameState.health + points);
      setGameState(prev => ({
        ...prev,
        money: prev.money - actualCost,
        health: newHealth,
        healthBoostCostMultiplier: prev.healthBoostCostMultiplier * 1.2,
        showHealthBoostModal: false,
        showHealthWarning: newHealth <= 60
      }));
    }
  };

  const canUseGoodSleep = () => gameTime - gameState.goodSleepLastUsed >= 300;
  const getGoodSleepCooldown = () => Math.max(0, 300 - (gameTime - gameState.goodSleepLastUsed));

  const handleGoodSleepClick = () => {
    if (canUseGoodSleep()) {
      setGameState(prev => ({ ...prev, showHealthBoostModal: false, goodSleepCountdown: 30 }));
    }
  };

  const handleCompleteTask = (taskType: 'facebook' | 'screenshot') => {
    const rewards = { facebook: 50000, screenshot: 50000 };
    if (!gameState.tasksCompleted[taskType]) {
      setGameState(prev => ({
        ...prev,
        money: prev.money + rewards[taskType],
        tasksCompleted: { ...prev.tasksCompleted, [taskType]: true }
      }));
    }
  };

  const handleClaimDailyReward = () => {
    const today = new Date().toDateString();
    const dailyRewards = [50000, 100000, 150000, 200000, 250000, 300000, 1000000];
    if (gameState.lastDailyRewardDate === today) return;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    let newStreak = 1;
    if (gameState.lastDailyRewardDate === yesterdayStr) {
      newStreak = (gameState.dailyRewardStreak % 7) + 1;
    }
    
    const rewardAmount = dailyRewards[newStreak - 1];
    setGameState(prev => ({
      ...prev,
      money: prev.money + rewardAmount,
      dailyRewardStreak: newStreak,
      lastDailyRewardDate: today,
      showDailyRewardModal: false,
      dailyRewardGlow: false
    }));
  };

  const BalanceHeader = () => (
    <>
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-lg px-5 py-4 relative">
        <p className="text-purple-100 text-xs mb-0.5">Total Balance</p>
        <h2 className="text-3xl font-bold mb-0.5" data-testid="text-balance">{formatCurrency(gameState.money)}</h2>
        <p className="text-purple-100 text-xs" data-testid="text-game-time">{formatGameTime(gameState.dayCount)}</p>
        <button 
          onClick={() => setGameState(prev => ({ ...prev, showDailyRewardModal: true }))}
          className={`absolute top-3 right-3 bg-purple-800 hover:bg-purple-900 text-purple-100 px-3 py-1.5 rounded-lg text-xs font-medium transition border border-purple-500/50 ${
            gameState.dailyRewardGlow ? 'animate-pulse ring-2 ring-yellow-400 ring-offset-2 ring-offset-purple-600' : ''
          }`}
          data-testid="button-daily-reward"
        >
          Daily Reward
        </button>
      </div>
      
      <div className={`bg-purple-900/80 rounded-b-lg shadow-lg mb-6 transition-all ${gameState.expenseGlow ? 'ring-2 ring-orange-400 ring-offset-2 ring-offset-slate-900 animate-pulse' : ''}`}>
        <button 
          onClick={toggleExpenseBreakdown}
          className="w-full py-2.5 px-5 flex items-center justify-between hover:bg-purple-900/90 transition"
          data-testid="button-liabilities"
        >
          <div className="flex items-center gap-2.5">
            <div className="bg-purple-800/60 p-1.5 rounded-full">
              <svg className="w-3.5 h-3.5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              {gameState.expensesDebited ? (
                <span className="text-orange-400 font-semibold text-xs">{formatCurrency(gameState.lastDeductedAmount)} was debited</span>
              ) : (
                <span className="text-purple-300 font-medium text-xs">Liabilities</span>
              )}
            </div>
          </div>
          <span className="text-purple-300 text-xs font-medium">
            {gameState.showExpenseBreakdown ? 'Close' : (gameState.expensesDebited ? 'See why' : 'View')}
          </span>
        </button>
        
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
          gameState.showExpenseBreakdown ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-5 pb-4 pt-2 border-t border-purple-800/50 bg-slate-900/50">
            <div className="space-y-3">
              {totalMaintenance > 0 ? (
                <div className="mb-2">
                  <p className="text-purple-300 font-semibold text-xs mb-2">Monthly Maintenance</p>
                  {gameState.lifestylePurchases.filter(p => p.maintenance > 0).map((purchase, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-400">{purchase.name}</span>
                      <span className="text-orange-400 font-semibold">{formatCurrency(purchase.maintenance)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs pt-2 mt-2 border-t border-slate-700">
                    <span className="text-purple-300 font-semibold">Total Debited</span>
                    <span className="text-orange-400 font-bold">{formatCurrency(totalMaintenance)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-xs text-center py-4">
                  No maintenance costs yet. Purchase cars, homes, yachts, or jets from the Lifestyle page to see costs here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const GameOverScreen = () => {
    const stats = gameState.finalStats;
    if (!stats) return null;
    
    const handleRestart = () => {
      localStorage.removeItem(STORAGE_KEY);
      setGameTime(0);
      setGameState(getDefaultGameState());
      setCurrentPage('home');
    };

    return (
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-red-900/50 shadow-2xl relative my-4">
          <div className="text-center mb-4">
            <div className="inline-block bg-red-900/30 p-3 rounded-full mb-3">
              <Heart size={36} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-1">Game Over</h2>
            <p className="text-slate-400 text-xs">Your health reached 50 or below</p>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-700">
            <h3 className="text-slate-300 font-semibold mb-3 text-center text-sm">Final Statistics</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Months Survived</span>
                <span className="text-slate-100 font-bold" data-testid="text-months-survived">{stats.monthsSurvived}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Final Balance</span>
                <span className="text-emerald-400 font-bold text-sm" data-testid="text-final-balance">{formatCurrency(stats.finalBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Total Earned</span>
                <span className="text-blue-400 font-bold text-sm" data-testid="text-total-earned">{formatCurrency(stats.totalEarned)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Achievements</span>
                <span className="text-purple-400 font-bold">{stats.achievementsUnlocked}</span>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Final Health</span>
                  <span className="text-red-400 font-bold">{stats.finalHealth}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/30 rounded-lg p-3 mb-4 border border-slate-700/50">
            <p className="text-slate-300 text-xs text-center">
              {stats.monthsSurvived < 6 ? "Keep practicing! Focus on maintaining your health." :
               stats.monthsSurvived < 12 ? "Good effort! Try to boost your health more frequently." :
               stats.monthsSurvived < 24 ? "Well done! You're getting better at managing resources." :
               "Impressive run! You've mastered the basics of survival."}
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleRestart}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-bold transition shadow-lg"
              data-testid="button-play-again"
            >
              Play Again
            </button>
            <p className="text-slate-500 text-xs text-center">Challenge yourself to survive longer!</p>
          </div>
        </div>
      </div>
    );
  };

  const IncomePage = () => {
    const getSkillCooldownRemaining = () => {
      const timeSinceLastBoost = gameTime - gameState.skill.lastBoostTime;
      const boostsInCycle = gameState.skill.boostCount % 5;
      if (boostsInCycle === 0 && gameState.skill.boostCount > 0 && timeSinceLastBoost < 20) {
        return 20 - timeSinceLastBoost;
      }
      return 0;
    };
    
    const getBusinessCooldownRemaining = () => {
      const timeSinceLastBoost = gameTime - gameState.miniBusiness.lastBoostTime;
      const boostsInCycle = gameState.miniBusiness.boostCount % 5;
      if (boostsInCycle === 0 && gameState.miniBusiness.boostCount > 0 && timeSinceLastBoost < 20) {
        return 20 - timeSinceLastBoost;
      }
      return 0;
    };
    
    const skillCooldown = getSkillCooldownRemaining();
    const businessCooldown = getBusinessCooldownRemaining();
    
    const handlePurchase = (type: 'skill' | 'miniBusiness') => {
      const purchases = {
        skill: { cost: 150000, key: 'skill' as const, name: 'Skill' },
        miniBusiness: { cost: 500000, key: 'miniBusiness' as const, name: 'Business' }
      };
      const purchase = purchases[type];
      
      if (type === 'miniBusiness' && !gameState.jobQuit) {
        setGameState(prev => ({ ...prev, showBusinessLockedModal: true }));
        return;
      }
      
      if (gameState.money >= purchase.cost) {
        setGameState(prev => ({
          ...prev,
          money: prev.money - purchase.cost,
          [purchase.key]: { ...prev[purchase.key], purchased: true }
        }));
      } else {
        const message = `You need ${formatCurrency(purchase.cost)} to unlock ${purchase.name}. You currently have ${formatCurrency(gameState.money)}.`;
        setGameState(prev => ({ ...prev, showInsufficientFundsModal: true, insufficientFundsMessage: message }));
      }
    };

    const handleQuitJob = () => {
      setGameState(prev => ({
        ...prev,
        jobQuit: true,
        showBusinessUnlockedNotification: true,
        businessUnlockedTime: gameTime
      }));
    };

    const handleBoostSkill = () => {
      const boostCost = 150000;
      if (gameState.skill.boostLevel >= 50) {
        setGameState(prev => ({
          ...prev,
          showBoostModal: false,
          showInsufficientFundsModal: true,
          insufficientFundsMessage: 'Your Skill is already at maximum level (50). You cannot boost it further.'
        }));
        return;
      }
      
      const timeSinceLastBoost = gameTime - gameState.skill.lastBoostTime;
      const boostsInCycle = gameState.skill.boostCount % 5;
      if (boostsInCycle === 0 && gameState.skill.boostCount > 0 && timeSinceLastBoost < 20) {
        const remaining = 20 - timeSinceLastBoost;
        setGameState(prev => ({
          ...prev,
          showBoostModal: false,
          showInsufficientFundsModal: true,
          insufficientFundsMessage: `Skill boost is on cooldown. Please wait ${remaining} more seconds before boosting again.`
        }));
        return;
      }
      
      if (gameState.money >= boostCost) {
        setGameState(prev => ({
          ...prev,
          money: prev.money - boostCost,
          skill: {
            ...prev.skill,
            income: prev.skill.income + 20000,
            boostLevel: prev.skill.boostLevel + 1,
            boostCount: prev.skill.boostCount + 1,
            lastBoostTime: gameTime
          },
          showBoostModal: false
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          showBoostModal: false,
          showInsufficientFundsModal: true,
          insufficientFundsMessage: `You need ${formatCurrency(boostCost)} to boost your Skill. You currently have ${formatCurrency(gameState.money)}.`
        }));
      }
    };

    const handleBoostBusiness = () => {
      const boostCost = 500000;
      const timeSinceLastBoost = gameTime - gameState.miniBusiness.lastBoostTime;
      const boostsInCycle = gameState.miniBusiness.boostCount % 5;
      
      if (boostsInCycle === 0 && gameState.miniBusiness.boostCount > 0 && timeSinceLastBoost < 20) {
        const remaining = 20 - timeSinceLastBoost;
        setGameState(prev => ({
          ...prev,
          showBusinessBoostModal: false,
          showInsufficientFundsModal: true,
          insufficientFundsMessage: `Business boost is on cooldown. Please wait ${remaining} more seconds before boosting again.`
        }));
        return;
      }
      
      if (gameState.money >= boostCost) {
        setGameState(prev => ({
          ...prev,
          money: prev.money - boostCost,
          miniBusiness: {
            ...prev.miniBusiness,
            income: prev.miniBusiness.income + 65000,
            boostLevel: prev.miniBusiness.boostLevel + 1,
            boostCount: prev.miniBusiness.boostCount + 1,
            lastBoostTime: gameTime
          },
          showBusinessBoostModal: false
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          showBusinessBoostModal: false,
          showInsufficientFundsModal: true,
          insufficientFundsMessage: `You need ${formatCurrency(boostCost)} to boost your Business. You currently have ${formatCurrency(gameState.money)}.`
        }));
      }
    };

    const handleInvest = () => {
      const investmentAmount = 10000000;
      if (gameState.money >= investmentAmount) {
        const profitOnly = Math.floor(investmentAmount * 0.15);
        setGameState(prev => ({
          ...prev,
          money: prev.money - investmentAmount,
          investment: {
            totalInvested: prev.investment.totalInvested + investmentAmount,
            returns: prev.investment.returns + profitOnly,
            timeLeft: 0,
            countdownMonths: prev.investment.countdownMonths > 0 ? prev.investment.countdownMonths : 12
          }
        }));
      }
    };

    return (
      <div className="pb-20">
        <BalanceHeader />

        <h2 className="text-xl font-bold text-slate-100 mb-4 px-1">Income Streams</h2>

        {!gameState.jobQuit && (
          <div className="bg-slate-800 rounded-xl p-5 mb-4 border border-slate-700/50 shadow-lg">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-base text-slate-100">Salary</h3>
              {gameState.salary.timeLeft > 0 && (
                <div className="bg-slate-700 px-3 py-1 rounded-lg border border-slate-600">
                  <p className="text-emerald-400 font-mono text-sm font-bold" data-testid="text-salary-timer">{formatTime(gameState.salary.timeLeft)}</p>
                </div>
              )}
            </div>
            <p className="text-emerald-400 font-bold text-lg mb-1">+{formatCurrency(50000)}</p>
            <p className="text-slate-400 text-xs mb-3">Every month - Auto-collect</p>
            
            {gameState.skill.boostLevel >= 10 ? (
              <button
                onClick={handleQuitJob}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-lg font-bold transition animate-pulse ring-2 ring-orange-400 ring-offset-2 ring-offset-slate-800"
                data-testid="button-quit-job"
              >
                Quit Job
              </button>
            ) : (
              gameState.salary.timeLeft > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{width: `${((60 - gameState.salary.timeLeft) / 60) * 100}%`}}></div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <div className="bg-slate-800 rounded-xl p-5 mb-4 border border-slate-700/50 shadow-lg">
          <h3 className="font-semibold text-base text-slate-100 mb-1">
            Skill
            {gameState.skill.boostLevel > 0 && (
              <span className="text-xs ml-2 bg-purple-600 px-2 py-0.5 rounded-full">Lv {gameState.skill.boostLevel}</span>
            )}
          </h3>
          <p className="text-emerald-400 font-bold text-lg mb-1">+{formatCurrency(gameState.skill.income)}</p>
          <p className="text-slate-400 text-xs mb-4">Every month - Auto-collect</p>
          {!gameState.skill.purchased ? (
            <button
              onClick={() => handlePurchase('skill')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 py-3 rounded-lg font-medium transition flex items-center justify-between px-4 text-sm border border-slate-600/50"
              data-testid="button-learn-skill"
            >
              <span>Learn a Skill</span>
              <span>{formatCurrency(150000)}</span>
            </button>
          ) : (
            <>
              {gameState.salary.timeLeft > 0 && (
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{width: `${((60 - gameState.salary.timeLeft) / 60) * 100}%`}}></div>
                  </div>
                  <div className="bg-slate-700 px-3 py-1 rounded-lg border border-slate-600">
                    <p className="text-emerald-400 font-mono text-xs font-bold whitespace-nowrap">{formatTime(gameState.salary.timeLeft)}</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setGameState(prev => ({ ...prev, showBoostModal: true }))}
                disabled={gameState.skill.boostLevel >= 50 || skillCooldown > 0}
                className={`w-full py-3 rounded-lg font-medium transition text-sm border ${
                  gameState.skill.boostLevel >= 50 || skillCooldown > 0
                    ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed border-slate-700'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600'
                }`}
                data-testid="button-boost-skill"
              >
                {gameState.skill.boostLevel >= 50 ? 'Max Level Reached' : skillCooldown > 0 ? `Please Wait (${skillCooldown}s)` : 'Boost Skill'}
              </button>
            </>
          )}
        </div>

        <div className={`bg-slate-800 rounded-xl p-5 mb-4 border border-slate-700/50 shadow-lg transition-all ${
          gameState.showBusinessUnlockedNotification ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900 animate-pulse' : ''
        }`}>
          <h3 className="font-semibold text-base text-slate-100 mb-1">
            Business
            {gameState.miniBusiness.boostLevel > 0 && (
              <span className="text-xs ml-2 bg-purple-600 px-2 py-0.5 rounded-full">Lv {gameState.miniBusiness.boostLevel}</span>
            )}
          </h3>
          <p className="text-emerald-400 font-bold text-lg mb-1">+{formatCurrency(gameState.miniBusiness.income)}</p>
          <p className="text-slate-400 text-xs mb-4">Every month - Auto-collect</p>
          {!gameState.miniBusiness.purchased ? (
            <button
              onClick={() => handlePurchase('miniBusiness')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 py-3 rounded-lg font-medium transition flex items-center justify-between px-4 text-sm border border-slate-600/50"
              data-testid="button-start-business"
            >
              <span>Start Business</span>
              <span>{formatCurrency(500000)}</span>
            </button>
          ) : (
            <>
              {gameState.salary.timeLeft > 0 && (
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{width: `${((60 - gameState.salary.timeLeft) / 60) * 100}%`}}></div>
                  </div>
                  <div className="bg-slate-700 px-3 py-1 rounded-lg border border-slate-600">
                    <p className="text-emerald-400 font-mono text-xs font-bold whitespace-nowrap">{formatTime(gameState.salary.timeLeft)}</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setGameState(prev => ({ ...prev, showBusinessBoostModal: true }))}
                disabled={businessCooldown > 0}
                className={`w-full py-3 rounded-lg font-medium transition text-sm border ${
                  businessCooldown > 0
                    ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed border-slate-700'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600'
                }`}
                data-testid="button-invest-business"
              >
                {businessCooldown > 0 ? `Please Wait (${businessCooldown}s)` : 'Invest ₦500K'}
              </button>
            </>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl p-5 mb-4 border border-slate-700/50 shadow-lg">
          <h3 className="font-semibold text-base text-slate-100 mb-1">Fixed Deposit</h3>
          <p className="text-emerald-400 font-bold text-lg mb-1">
            {gameState.investment.countdownMonths > 0 ? (
              <>+{formatCurrency(gameState.investment.totalInvested + gameState.investment.returns)} 
              <span className="text-xs text-slate-400 ml-2">(Capital + 15% profit)</span></>
            ) : (
              <>+{formatCurrency(Math.floor(10000000 * 1.15))} 
              <span className="text-xs text-slate-400 ml-2">(15% return)</span></>
            )}
          </p>
          <p className="text-slate-400 text-xs mb-2">Every Year (12 months) - Min. investment: ₦10M</p>
          {gameState.investment.totalInvested > 0 && (
            <p className="text-purple-300 text-xs mb-4">
              Invested: {formatCurrency(gameState.investment.totalInvested)} - Matures in {gameState.investment.countdownMonths} {gameState.investment.countdownMonths === 1 ? 'month' : 'months'}
            </p>
          )}
          
          {gameState.investment.countdownMonths > 0 && (
            <div className="mb-3 bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs">Maturity Progress</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {12 - gameState.investment.countdownMonths}/12 months
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                  style={{width: `${((12 - gameState.investment.countdownMonths) / 12) * 100}%`}}
                ></div>
              </div>
            </div>
          )}

          <button
            onClick={handleInvest}
            disabled={gameState.money < 10000000}
            className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 disabled:text-slate-600 text-slate-100 py-3 rounded-lg font-medium transition text-sm border border-slate-600"
            data-testid="button-invest-deposit"
          >
            Invest ₦10M
          </button>
        </div>

        {gameState.showBoostModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Boost Skill Income</h3>
              <p className="text-slate-400 text-sm mb-4">Increase your skill income by ₦20,000/month</p>
              <div className="mb-4">
                <p className="text-slate-300 text-sm">Current Level: {gameState.skill.boostLevel}</p>
                <p className="text-slate-300 text-sm">Current Income: {formatCurrency(gameState.skill.income)}</p>
                <p className="text-green-400 text-sm">Next Income: {formatCurrency(gameState.skill.income + 20000)}</p>
                <p className="text-amber-400 font-bold mt-2">Cost: {formatCurrency(150000)}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleBoostSkill}
                  className={`flex-1 py-2 rounded-lg font-semibold transition ${
                    gameState.money >= 150000 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-700 text-slate-500'
                  }`}
                  data-testid="button-confirm-boost-skill"
                >
                  Boost
                </button>
                <button 
                  onClick={() => setGameState(prev => ({ ...prev, showBoostModal: false }))}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition"
                  data-testid="button-cancel-boost"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState.showBusinessBoostModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Boost Business Income</h3>
              <p className="text-slate-400 text-sm mb-4">Increase your business income by ₦65,000/month</p>
              <div className="mb-4">
                <p className="text-slate-300 text-sm">Current Level: {gameState.miniBusiness.boostLevel}</p>
                <p className="text-slate-300 text-sm">Current Income: {formatCurrency(gameState.miniBusiness.income)}</p>
                <p className="text-green-400 text-sm">Next Income: {formatCurrency(gameState.miniBusiness.income + 65000)}</p>
                <p className="text-amber-400 font-bold mt-2">Cost: {formatCurrency(500000)}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleBoostBusiness}
                  className={`flex-1 py-2 rounded-lg font-semibold transition ${
                    gameState.money >= 500000 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-700 text-slate-500'
                  }`}
                  data-testid="button-confirm-boost-business"
                >
                  Boost
                </button>
                <button 
                  onClick={() => setGameState(prev => ({ ...prev, showBusinessBoostModal: false }))}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState.showBusinessLockedModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 max-w-sm w-full border border-purple-700 shadow-2xl">
              <div className="text-center mb-4">
                <div className="inline-block bg-purple-800/30 p-3 rounded-full mb-3">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-purple-300 mb-2">Business Locked</h3>
                <p className="text-slate-300 text-sm mb-4">You can't manage a business and a job at the same time!</p>
                <div className="bg-slate-900/50 rounded-lg p-4 mb-4 border border-slate-700 text-left">
                  <p className="text-slate-400 text-xs mb-3">To unlock business:</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 text-lg">1.</span>
                      <p className="text-slate-300 text-sm">Go to the <span className="text-purple-400 font-semibold">Income</span> page</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 text-lg">2.</span>
                      <p className="text-slate-300 text-sm">Boost your <span className="text-purple-400 font-semibold">Skill</span> to Level 10</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 text-lg">3.</span>
                      <p className="text-slate-300 text-sm">Click <span className="text-orange-400 font-semibold">"Quit Job"</span> when it appears</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 text-lg">4.</span>
                      <p className="text-slate-300 text-sm">Business will be <span className="text-emerald-400 font-semibold">unlocked!</span></p>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-xs">
                  Current Skill Level: <span className="text-purple-400 font-semibold">{gameState.skill.boostLevel}/10</span>
                </p>
              </div>
              <button
                onClick={() => setGameState(prev => ({ ...prev, showBusinessLockedModal: false }))}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
                data-testid="button-got-it-locked"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const PortfolioPage = () => {
    let totalMonthlyIncome = gameState.jobQuit ? 0 : 50000;
    if (gameState.skill.purchased) totalMonthlyIncome += gameState.skill.income;
    if (gameState.miniBusiness.purchased) totalMonthlyIncome += gameState.miniBusiness.income;
    
    const achievementMilestones = [
      { amount: 500000, label: '₦500K', reward: 25000 },
      { amount: 5000000, label: '₦5M', reward: 250000 },
      { amount: 50000000, label: '₦50M', reward: 2500000 },
      { amount: 500000000, label: '₦500M', reward: 25000000 },
      { amount: 5000000000, label: '₦5B', reward: 250000000 },
      { amount: 50000000000, label: '₦50B', reward: 2500000000 },
      { amount: 500000000000, label: '₦500B', reward: 25000000000 },
      { amount: 5000000000000, label: '₦5T', reward: 250000000000 }
    ];

    return (
      <div className="pb-20">
        <BalanceHeader />

        {gameState.investment.totalInvested > 0 && (
          <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800 rounded-xl p-5 mb-4 border border-emerald-700/50">
            <p className="text-emerald-400 text-sm mb-1">Investment Portfolio</p>
            <h3 className="text-3xl font-bold text-slate-100 mb-4">
              {formatCurrency(gameState.investment.totalInvested + gameState.investment.returns)}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Principal Invested</span>
                <span className="text-slate-200 font-semibold">{formatCurrency(gameState.investment.totalInvested)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Expected Returns (15%)</span>
                <span className="text-emerald-400 font-semibold">{formatCurrency(gameState.investment.returns)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Matures In</span>
                <span className="text-blue-300 font-semibold">{gameState.investment.countdownMonths} {gameState.investment.countdownMonths === 1 ? 'month' : 'months'}</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-3 italic">One-time payout when investment matures</p>
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-900/30 to-slate-800 rounded-xl p-5 mb-4 border-2 border-blue-700/50 relative">
          <div className="flex items-center justify-between mb-1">
            <p className="text-blue-400 text-sm">Monthly Income</p>
            <div className="flex items-center gap-1 bg-blue-900/50 px-2 py-1 rounded-full">
              <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-yellow-400 text-[10px] font-bold">For Achievements</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-100 mb-4" data-testid="text-monthly-income">
            {formatCurrency(totalMonthlyIncome)}
          </h3>
          
          <div className="space-y-3">
            {!gameState.jobQuit && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Salary</span>
                <span className="text-slate-200 font-semibold">{formatCurrency(50000)}</span>
              </div>
            )}
            {gameState.skill.purchased && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Skill</span>
                <span className="text-slate-200 font-semibold">{formatCurrency(gameState.skill.income)}</span>
              </div>
            )}
            {gameState.miniBusiness.purchased && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Business</span>
                <span className="text-slate-200 font-semibold">{formatCurrency(gameState.miniBusiness.income)}</span>
              </div>
            )}
          </div>
          
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-blue-600 rounded-full p-1.5 shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 mb-6 border-2 border-blue-700/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-100">Achievements</h3>
            <div className="flex items-center gap-1 text-blue-400 text-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Based on Monthly Income</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs mb-4">Reach income milestones to unlock achievements. Each gives a 5% cash reward.</p>
          <div className="grid grid-cols-2 gap-3">
            {achievementMilestones.map(milestone => {
              const achieved = totalMonthlyIncome >= milestone.amount;
              const justAchieved = achieved && !gameState.achievements.includes(`income_${milestone.amount}`);
              
              if (justAchieved) {
                setTimeout(() => {
                  setGameState(prev => ({
                    ...prev,
                    money: prev.money + milestone.reward,
                    achievements: [...prev.achievements, `income_${milestone.amount}`],
                    showAchievementNotification: true,
                    achievementAmount: milestone.amount,
                    achievementNotificationTime: gameTime
                  }));
                }, 100);
              }
              
              return (
                <div 
                  key={milestone.amount}
                  className={`p-3 rounded-lg border transition ${
                    achieved ? 'bg-emerald-900/30 border-emerald-700 text-emerald-400' : 'bg-slate-900/50 border-slate-700 text-slate-600'
                  }`}
                  data-testid={`achievement-${milestone.amount}`}
                >
                  <div className="text-xl mb-1">{achieved ? '🔓' : '🔒'}</div>
                  <p className="text-xs font-semibold mb-1">{milestone.label}</p>
                  {achieved && <p className="text-emerald-300 text-xs">+{formatCurrency(milestone.reward)}</p>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Collections</h3>
          {gameState.lifestylePurchases.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No lifestyle purchases yet</p>
          ) : (
            <div className="space-y-3">
              {gameState.lifestylePurchases.map((purchase, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                  <div>
                    <p className="text-slate-200 font-semibold text-sm">{purchase.name}</p>
                    <p className="text-slate-500 text-xs">{purchase.category}</p>
                  </div>
                  <p className="text-slate-400 text-sm">{formatCurrency(purchase.price)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const LifestylePage = () => {
    const categories = [
      { id: 'home', label: 'Home' },
      { id: 'car', label: 'Car' },
      { id: 'yacht', label: 'Yacht' },
      { id: 'jet', label: 'Jet' }
    ];

    const items: Record<string, LifestyleItem[]> = {
      home: [
        { id: 'bungalow', name: 'Bungalow', price: 25000000, image: '🏠', maintenance: 750000 },
        { id: 'duplex', name: 'Duplex', price: 80000000, image: '🏘️', maintenance: 2400000 },
        { id: 'mansion', name: 'Mansion', price: 250000000, image: '🏰', maintenance: 7500000 },
        { id: 'penthouse', name: 'Penthouse', price: 500000000, image: '🏙️', maintenance: 15000000 }
      ],
      car: [
        { id: 'toyota', name: 'Toyota Corolla', price: 15000000, image: '🚗', maintenance: 450000 },
        { id: 'lexus', name: 'Lexus ES', price: 35000000, image: '🚙', maintenance: 1050000 },
        { id: 'bmw', name: 'BMW 7 Series', price: 80000000, image: '🚘', maintenance: 2400000 },
        { id: 'mercedes', name: 'Mercedes G-Wagon', price: 450000000, image: '🚙', maintenance: 13500000 },
        { id: 'bentley', name: 'Bentley Continental', price: 800000000, image: '🏎️', maintenance: 24000000 }
      ],
      yacht: [
        { id: 'speedboat', name: 'Speedboat', price: 50000000, image: '🚤', maintenance: 1500000 },
        { id: 'yacht_small', name: 'Small Yacht', price: 200000000, image: '⛵', maintenance: 6000000 },
        { id: 'yacht_luxury', name: 'Luxury Yacht', price: 1000000000, image: '🛥️', maintenance: 30000000 },
        { id: 'mega_yacht', name: 'Mega Yacht', price: 5000000000, image: '🚢', maintenance: 150000000 }
      ],
      jet: [
        { id: 'light_jet', name: 'Light Jet', price: 2000000000, image: '✈️', maintenance: 60000000 },
        { id: 'midsize_jet', name: 'Midsize Jet', price: 8000000000, image: '🛩️', maintenance: 240000000 },
        { id: 'heavy_jet', name: 'Heavy Jet', price: 20000000000, image: '✈️', maintenance: 600000000 },
        { id: 'airliner', name: 'Private Airliner', price: 50000000000, image: '🛫', maintenance: 1500000000 }
      ]
    };

    const handlePurchase = (item: LifestyleItem) => {
      if (gameState.money >= item.price) {
        setGameState(prev => ({
          ...prev,
          money: prev.money - item.price,
          lifestylePurchases: [...prev.lifestylePurchases, {
            id: item.id,
            name: item.name,
            category: activeCategory,
            price: item.price,
            maintenance: item.maintenance,
            isRent: item.isRent || false,
            image: item.image
          }]
        }));
      }
    };

    const isPurchased = (itemId: string) => gameState.lifestylePurchases.some(p => p.id === itemId);

    return (
      <div className="pb-20">
        <BalanceHeader />

        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 px-1 min-w-max">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                }`}
                data-testid={`button-category-${category.id}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {items[activeCategory].map(item => (
            <div key={item.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg" data-testid={`card-item-${item.id}`}>
              <div className="flex flex-col">
                <div className="w-full h-48 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-7xl border-b border-slate-700">
                  {item.image}
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-slate-100 mb-2 text-lg">{item.name}</h3>
                  <p className="text-emerald-400 font-bold text-2xl mb-3">{formatCurrency(item.price)}</p>
                  
                  {item.maintenance > 0 && (
                    <p className="text-orange-400 text-sm mb-3 flex items-center gap-2">
                      <span>⚙️</span>
                      <span>Maintenance: {formatCurrency(item.maintenance)}/month</span>
                    </p>
                  )}
                  
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={gameState.money < item.price || isPurchased(item.id)}
                    className={`w-full py-3 rounded-lg font-semibold text-base transition ${
                      isPurchased(item.id)
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : gameState.money >= item.price
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                    data-testid={`button-buy-${item.id}`}
                  >
                    {isPurchased(item.id) ? 'Owned' : gameState.money >= item.price ? 'Buy Now' : 'Insufficient Funds'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const HomePage = () => (
    <div className="pb-20">
      <BalanceHeader />

      <div className={`bg-slate-800 rounded-lg p-6 mb-6 border transition-all ${
        gameState.health <= 60 ? 'border-red-500 ring-2 ring-red-500 ring-opacity-50 animate-pulse' : 'border-slate-700'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-red-400" />
            <span className="text-slate-400 text-base">Health</span>
          </div>
          <button
            onClick={() => setGameState(prev => ({ ...prev, gamePaused: !prev.gamePaused }))}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
              gameState.gamePaused ? 'bg-emerald-700 hover:bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
            data-testid="button-pause-resume"
          >
            {gameState.gamePaused ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span className="text-xs font-medium">Resume</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                <span className="text-xs font-medium">Pause</span>
              </>
            )}
          </button>
        </div>
        <p className={`text-4xl font-bold mb-4 ${gameState.health <= 50 ? 'text-red-400' : gameState.health <= 60 ? 'text-orange-400' : 'text-slate-200'}`} data-testid="text-health">{gameState.health}</p>
        <button 
          onClick={() => setGameState(prev => ({ ...prev, showHealthBoostModal: true }))}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-2.5 rounded-lg transition"
          data-testid="button-boost-health"
        >
          Boost Health
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-sm text-slate-300 mb-4">
        <p className="mb-3 font-semibold"><span className="text-orange-500">WARNING!!!</span></p>
        <div className="space-y-2 text-slate-400">
          <p>Your health drops by 5 points every month</p>
          <p>If health reaches 50 or below = Game Over!</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-slate-100 mb-4 px-1">Earn More</h3>
        
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-blue-900/30 to-slate-800 rounded-xl p-4 border border-blue-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-slate-100 font-bold text-base mb-1">Refer & Earn</h4>
                <p className="text-slate-400 text-xs">Invite friends to join Naija Wealth Sim</p>
              </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-3 mb-3 border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300 text-sm">You earn</span>
                <span className="text-emerald-400 font-bold text-lg">₦500,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">Your friend gets</span>
                <span className="text-blue-400 font-bold text-lg">₦100,000</span>
              </div>
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition shadow-lg" data-testid="button-share-referral">
              Share Referral Link
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600/20 p-2.5 rounded-lg">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-100 font-semibold text-sm">Follow on Facebook</h4>
                  <p className="text-slate-500 text-xs">Stay updated with us</p>
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-sm">+₦50K</span>
            </div>
            
            <button
              onClick={() => handleCompleteTask('facebook')}
              disabled={gameState.tasksCompleted.facebook}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                gameState.tasksCompleted.facebook
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              data-testid="button-follow-facebook"
            >
              {gameState.tasksCompleted.facebook ? 'Completed' : 'Follow Now'}
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2.5 rounded-lg">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-slate-100 font-semibold text-sm">Share Your Progress</h4>
                  <p className="text-slate-500 text-xs">Post a screenshot</p>
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-sm">+₦50K</span>
            </div>
            
            <button
              onClick={() => handleCompleteTask('screenshot')}
              disabled={gameState.tasksCompleted.screenshot}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                gameState.tasksCompleted.screenshot
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
              data-testid="button-share-progress"
            >
              {gameState.tasksCompleted.screenshot ? 'Completed' : 'Share Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 max-w-md mx-auto">
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down { animation: slide-down 0.5s ease-out; }
        
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          top: 0;
          animation: confetti-fall 3s ease-out forwards;
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .sparkle { animation: sparkle 0.6s ease-in-out infinite; }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.8); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>
      
      {/* Achievement Notification with Confetti */}
      {gameState.showAchievementNotification && (
        <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none overflow-hidden">
          {/* Confetti pieces */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][Math.floor(Math.random() * 6)],
                animationDelay: `${Math.random() * 0.5}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
          
          {/* Notification Banner */}
          <div className="animate-slide-down p-4 pointer-events-auto">
            <div 
              className="bg-gradient-to-r from-purple-900/95 via-slate-900/95 to-purple-900/95 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto border border-purple-500/50 shadow-2xl pulse-glow"
              onClick={() => {
                setGameState(prev => ({ ...prev, showAchievementNotification: false }));
                setCurrentPage('portfolio');
              }}
              data-testid="notification-achievement"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-yellow-400 to-amber-600 p-2 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 5.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 11H13a1 1 0 100-2H8.414l1.293-1.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-amber-300 font-bold text-sm">Achievement Unlocked!</p>
                  <p className="text-slate-200 text-xs">
                    Monthly income reached <span className="text-emerald-400 font-bold">{formatCurrency(gameState.achievementAmount)}</span>
                  </p>
                  <p className="text-purple-300 text-xs mt-1">Tap to view Portfolio</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setGameState(prev => ({ ...prev, showAchievementNotification: false }));
                  }}
                  className="text-slate-400 hover:text-white transition"
                  data-testid="button-close-achievement"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Achievements Complete Modal */}
      {gameState.showAllAchievementsComplete && !gameState.showGameWon && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-hidden">
          {/* Confetti background */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][Math.floor(Math.random() * 6)],
                animationDelay: `${Math.random() * 1}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
          
          <div className="bg-gradient-to-b from-purple-900 via-slate-900 to-slate-900 rounded-2xl p-6 max-w-md w-full border-2 border-purple-500 shadow-2xl relative z-10">
            <div className="text-center mb-6">
              <div className="inline-block bg-gradient-to-br from-yellow-400 to-amber-600 p-4 rounded-full mb-4 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                All Achievements Unlocked!
              </h2>
              <p className="text-slate-300 text-sm mb-4">
                You've reached all 8 income milestones. Incredible progress!
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-emerald-400 font-bold text-sm">Final Challenge</p>
                  <p className="text-slate-400 text-xs">Complete your collection to win!</p>
                </div>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">
                Purchase <span className="text-purple-400 font-bold">all lifestyle items</span> (homes, cars, yachts, and jets) to achieve <span className="text-amber-400 font-bold">Financial Freedom</span> and win the game!
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400">Items Owned:</span>
                <span className="text-purple-400 font-bold">{gameState.lifestylePurchases.length} / {ALL_LIFESTYLE_ITEM_IDS.length}</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setGameState(prev => ({ ...prev, showAllAchievementsComplete: false }));
                setCurrentPage('lifestyle');
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition shadow-lg"
              data-testid="button-go-shopping"
            >
              Go Shopping
            </button>
          </div>
        </div>
      )}

      {/* Game Won Victory Screen */}
      {gameState.showGameWon && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-hidden">
          {/* Celebration confetti */}
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#ffd700', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][Math.floor(Math.random() * 7)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                width: `${8 + Math.random() * 8}px`,
                height: `${8 + Math.random() * 8}px`,
              }}
            />
          ))}
          
          <div className="bg-gradient-to-b from-amber-900/90 via-slate-900 to-slate-900 rounded-2xl p-6 max-w-md w-full border-2 border-amber-500 shadow-2xl relative z-10 my-4">
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 p-5 rounded-full shadow-lg">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                {/* Sparkle effects */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full sparkle" style={{animationDelay: '0s'}} />
                <div className="absolute -bottom-1 -left-3 w-3 h-3 bg-amber-400 rounded-full sparkle" style={{animationDelay: '0.2s'}} />
                <div className="absolute top-1/2 -right-4 w-2 h-2 bg-yellow-200 rounded-full sparkle" style={{animationDelay: '0.4s'}} />
              </div>
              
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 mb-2">
                FINANCIAL FREEDOM!
              </h2>
              <p className="text-amber-200 text-lg font-semibold mb-1">You Won!</p>
              <p className="text-slate-300 text-sm">
                You've achieved complete financial independence
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-amber-700/50">
              <h3 className="text-amber-300 font-bold text-center mb-3">Victory Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Time Played</span>
                  <span className="text-slate-200 font-bold">{formatGameTime(gameState.dayCount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Final Balance</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(gameState.money)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total Earned</span>
                  <span className="text-blue-400 font-bold">{formatCurrency(gameState.totalEarned)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Achievements</span>
                  <span className="text-purple-400 font-bold">{gameState.achievements.length} / 8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Items Collected</span>
                  <span className="text-pink-400 font-bold">{gameState.lifestylePurchases.length} / {ALL_LIFESTYLE_ITEM_IDS.length}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-xl p-4 mb-6 border border-emerald-700/50 text-center">
              <p className="text-emerald-300 text-sm font-semibold mb-1">
                Congratulations, Wealth Master!
              </p>
              <p className="text-slate-300 text-xs">
                You've proven that smart financial decisions lead to lasting success.
              </p>
            </div>
            
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setGameTime(0);
                setGameState(getDefaultGameState());
                setCurrentPage('home');
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 py-4 rounded-xl font-bold text-lg transition shadow-lg"
              data-testid="button-play-again"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {gameState.goodSleepCountdown > 0 && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-blue-900 to-slate-900 rounded-2xl p-8 max-w-sm w-full border border-blue-700 shadow-2xl text-center">
            <div className="mb-6">
              <div className="bg-blue-500/20 p-4 rounded-full inline-block mb-4">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-300 mb-2">Good Sleep Ad</h3>
              <p className="text-slate-300 text-sm mb-4">Watch this ad to boost your health</p>
              
              <div className="bg-slate-900/50 rounded-xl p-6 mb-4 border border-slate-700">
                <p className="text-slate-400 text-xs mb-2">Advertisement Playing...</p>
                <div className="text-6xl font-bold text-blue-400 mb-2">{gameState.goodSleepCountdown}</div>
                <p className="text-slate-500 text-xs">seconds remaining</p>
              </div>
              
              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart size={20} className="text-red-400" />
                  <span className="text-slate-300 text-sm">Health Reward</span>
                </div>
                <p className="text-emerald-400 font-bold text-2xl">+25 Health</p>
              </div>
            </div>
            <p className="text-slate-500 text-xs">Please wait for the ad to complete...</p>
          </div>
        </div>
      )}

      {gameState.showHealthBoostModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-700 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-500/20 p-3 rounded-xl">
                <Heart size={24} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Boost Your Health</h3>
                <p className="text-slate-400 text-sm">Invest in your wellbeing</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button 
                onClick={handleGoodSleepClick}
                disabled={!canUseGoodSleep()}
                className={`w-full p-4 rounded-xl font-semibold transition border ${
                  canUseGoodSleep()
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                }`}
                data-testid="button-good-sleep"
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="font-bold">Good Sleep</div>
                    <div className="text-xs opacity-70">
                      {canUseGoodSleep() ? 'Watch 30s ad for +25 Health' : `Cooldown: ${formatTime(getGoodSleepCooldown())}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{canUseGoodSleep() ? 'FREE' : '🔒'}</div>
                    <div className={`text-xs ${canUseGoodSleep() ? 'text-blue-200' : 'text-slate-600'}`}>
                      {canUseGoodSleep() ? 'Watch Ad' : 'Locked'}
                    </div>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => handleHealthBoost('food')}
                disabled={gameState.money < Math.floor(25000 * gameState.healthBoostCostMultiplier)}
                className={`w-full p-4 rounded-xl font-semibold transition border ${
                  gameState.money >= Math.floor(25000 * gameState.healthBoostCostMultiplier)
                    ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
                    : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                }`}
                data-testid="button-healthy-food"
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="font-bold">Healthy Food</div>
                    <div className="text-xs opacity-70">Nutrition & Vitamins</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatCurrency(Math.floor(25000 * gameState.healthBoostCostMultiplier))}</div>
                    <div className="text-xs text-emerald-400">+3 Health</div>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => handleHealthBoost('exercise')}
                disabled={gameState.money < Math.floor(50000 * gameState.healthBoostCostMultiplier)}
                className={`w-full p-4 rounded-xl font-semibold transition border ${
                  gameState.money >= Math.floor(50000 * gameState.healthBoostCostMultiplier)
                    ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
                    : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                }`}
                data-testid="button-exercise"
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="font-bold">Exercise Routine</div>
                    <div className="text-xs opacity-70">Fitness & Strength</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatCurrency(Math.floor(50000 * gameState.healthBoostCostMultiplier))}</div>
                    <div className="text-xs text-emerald-400">+5 Health</div>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => handleHealthBoost('checkup')}
                disabled={gameState.money < Math.floor(100000 * gameState.healthBoostCostMultiplier)}
                className={`w-full p-4 rounded-xl font-semibold transition border ${
                  gameState.money >= Math.floor(100000 * gameState.healthBoostCostMultiplier)
                    ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
                    : 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                }`}
                data-testid="button-medical-checkup"
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="font-bold">Medical Checkup</div>
                    <div className="text-xs opacity-70">Professional Care</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatCurrency(Math.floor(100000 * gameState.healthBoostCostMultiplier))}</div>
                    <div className="text-xs text-emerald-400">+10 Health</div>
                  </div>
                </div>
              </button>
            </div>

            <button 
              onClick={() => setGameState(prev => ({ ...prev, showHealthBoostModal: false }))}
              className="w-full py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-600"
              data-testid="button-close-health-modal"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {gameState.showDailyRewardModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500/20 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Daily Rewards</h3>
              </div>
              <button 
                onClick={() => setGameState(prev => ({ ...prev, showDailyRewardModal: false }))}
                className="text-slate-400 hover:text-slate-200"
                data-testid="button-close-daily-reward"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-slate-300 text-sm text-center mb-4">Claim your reward and build your streak!</p>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { day: 1, amount: 50000 },
                  { day: 2, amount: 100000 },
                  { day: 3, amount: 150000 },
                  { day: 4, amount: 200000 },
                  { day: 5, amount: 250000 },
                  { day: 6, amount: 300000 },
                  { day: 7, amount: 1000000 }
                ].map((reward) => {
                  const isCurrentDay = gameState.dailyRewardStreak === reward.day - 1 || 
                                      (gameState.dailyRewardStreak === 0 && reward.day === 1);
                  const isPastDay = gameState.dailyRewardStreak >= reward.day;
                  const today = new Date().toDateString();
                  const canClaim = gameState.lastDailyRewardDate !== today && isCurrentDay;
                  
                  return (
                    <div 
                      key={reward.day}
                      className={`p-3 rounded-lg border transition ${
                        canClaim
                          ? 'bg-yellow-900/30 border-yellow-500 ring-2 ring-yellow-400 animate-pulse'
                          : isPastDay
                          ? 'bg-emerald-900/30 border-emerald-700'
                          : 'bg-slate-900/50 border-slate-700'
                      }`}
                    >
                      <div className="text-center">
                        <p className={`text-xs mb-1 ${canClaim ? 'text-yellow-400' : isPastDay ? 'text-emerald-400' : 'text-slate-500'}`}>
                          Day {reward.day}
                        </p>
                        <p className={`font-bold text-sm ${canClaim ? 'text-yellow-300' : isPastDay ? 'text-emerald-300' : 'text-slate-600'}`}>
                          {formatCurrency(reward.amount)}
                        </p>
                        {isPastDay && <p className="text-emerald-400 text-xs mt-1">Done</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-3 mb-4 border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Current Streak</span>
                <span className="text-yellow-400 font-bold text-lg">
                  {gameState.dailyRewardStreak} {gameState.dailyRewardStreak === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>

            <button 
              onClick={handleClaimDailyReward}
              disabled={gameState.lastDailyRewardDate === new Date().toDateString()}
              className={`w-full py-3 rounded-xl font-bold transition text-base ${
                gameState.lastDailyRewardDate === new Date().toDateString()
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg'
              }`}
              data-testid="button-claim-daily-reward"
            >
              {gameState.lastDailyRewardDate === new Date().toDateString() ? 'Come Back Tomorrow' : 'Claim Reward'}
            </button>
          </div>
        </div>
      )}

      {gameState.showHealthWarning && currentPage !== 'home' && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-red-900 border-2 border-red-500 rounded-xl px-4 py-3 shadow-2xl max-w-sm">
            <div className="flex items-center gap-3">
              <Heart size={24} className="text-red-400" />
              <div>
                <p className="text-red-100 font-bold text-sm">Health Alert!</p>
                <p className="text-red-200 text-xs">Your health decreased to {gameState.health}</p>
              </div>
              <button 
                onClick={() => setGameState(prev => ({ ...prev, showHealthWarning: false }))}
                className="ml-2 text-red-300 hover:text-red-100"
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState.gameOver ? (
        <GameOverScreen />
      ) : (
        <>
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'income' && <IncomePage />}
          {currentPage === 'portfolio' && <PortfolioPage />}
          {currentPage === 'lifestyle' && <LifestylePage />}
        </>
      )}

      {gameState.showBusinessUnlockedNotification && !gameState.gameOver && (
        <div className="fixed top-20 left-0 right-0 z-50 px-4 animate-slide-up">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-4 max-w-md mx-auto shadow-2xl border-2 border-white/20">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Business Unlocked!</p>
                <p className="text-emerald-100 text-xs">You can now start a business on the Income page</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState.showReversalNotification && !gameState.gameOver && gameState.reversedItems.length > 0 && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 max-w-sm w-full border border-orange-700 shadow-2xl">
            <div className="text-center mb-4">
              <div className="inline-block bg-orange-900/30 p-3 rounded-full mb-3">
                <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-orange-400 mb-3">Items Sold Due to Maintenance</h3>
              <p className="text-slate-300 text-sm mb-4">
                You couldn't afford the maintenance costs, so the following {gameState.reversedItems.length === 1 ? 'item was' : 'items were'} automatically sold:
              </p>
              
              <div className="bg-slate-900/50 rounded-lg p-4 mb-4 space-y-3">
                {gameState.reversedItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
                    <div className="text-3xl">{item.image || '📦'}</div>
                    <div className="flex-1 text-left">
                      <p className="text-slate-200 font-semibold text-sm">{item.name}</p>
                      <p className="text-orange-400 text-xs">Maintenance: {formatCurrency(item.maintenance)}/month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold text-sm">+{formatCurrency(item.price)}</p>
                      <p className="text-slate-500 text-xs">refunded</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-slate-400 text-xs leading-relaxed">
                The purchase price has been refunded to your account. Make sure your monthly income can cover maintenance costs before buying luxury items.
              </p>
            </div>
            
            <button
              onClick={() => setGameState(prev => ({ ...prev, showReversalNotification: false }))}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold transition"
              data-testid="button-understood-reversal"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {gameState.showInsufficientFundsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 max-w-sm w-full border border-red-700 shadow-2xl">
            <div className="text-center mb-4">
              <div className="inline-block bg-red-900/30 p-3 rounded-full mb-3">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Insufficient Funds</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{gameState.insufficientFundsMessage}</p>
            </div>
            <button
              onClick={() => setGameState(prev => ({ ...prev, showInsufficientFundsModal: false }))}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-3 rounded-xl font-semibold transition"
              data-testid="button-got-it-insufficient"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {gameState.showBannerAd && !gameState.gameOver && (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4 animate-slide-up">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 max-w-md mx-auto shadow-2xl border-2 border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Watch Ad & Earn!</p>
                  <p className="text-blue-100 text-xs">Get rewards instantly</p>
                </div>
              </div>
              <button
                onClick={() => setGameState(prev => ({ ...prev, showBannerAd: false }))}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
                data-testid="button-close-banner"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around p-3 max-w-md mx-auto">
        <button 
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
            currentPage === 'home' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
          data-testid="nav-home"
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </button>
        
        <button 
          onClick={() => setCurrentPage('income')}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition relative ${
            currentPage === 'income' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
          data-testid="nav-income"
        >
          <Briefcase size={20} />
          <span className="text-xs">Income</span>
        </button>

        <button 
          onClick={() => setCurrentPage('portfolio')}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
            currentPage === 'portfolio' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
          data-testid="nav-portfolio"
        >
          <TrendingUp size={20} />
          <span className="text-xs">Portfolio</span>
        </button>

        <button 
          onClick={() => setCurrentPage('lifestyle')}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
            currentPage === 'lifestyle' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
          data-testid="nav-lifestyle"
        >
          <Sparkles size={20} />
          <span className="text-xs">Lifestyle</span>
        </button>
      </div>
    </div>
  );
}
