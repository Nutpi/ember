export type Locale = "zh" | "en";

const translations = {
  // Common
  "common.loading": { zh: "加载中...", en: "Loading..." },
  "common.you": { zh: "你", en: "You" },

  // Home
  "home.tagline": {
    zh: "写给重要的人。一个温暖的双人信件应用，用文字传递心意。",
    en: "Write to someone who matters. A warm letter app for two, delivering feelings through words.",
  },
  "home.getStarted": { zh: "开始使用", en: "Get Started" },
  "home.signIn": { zh: "登录", en: "Sign In" },

  // Header
  "header.timeline": { zh: "时间线", en: "Timeline" },
  "header.compose": { zh: "写信", en: "Compose" },
  "header.pair": { zh: "配对", en: "Pair" },
  "header.settings": { zh: "设置", en: "Settings" },
  "header.logout": { zh: "退出", en: "Logout" },
  "header.signIn": { zh: "登录", en: "Sign In" },
  "header.signUp": { zh: "注册", en: "Sign Up" },

  // Login
  "login.title": { zh: "登录", en: "Sign In" },
  "login.welcome": { zh: "欢迎回来", en: "Welcome back" },
  "login.email": { zh: "邮箱", en: "Email" },
  "login.password": { zh: "密码", en: "Password" },
  "login.loading": { zh: "登录中...", en: "Signing in..." },
  "login.submit": { zh: "登录", en: "Sign In" },
  "login.forgotPassword": { zh: "忘记密码？", en: "Forgot password?" },
  "login.noAccount": { zh: "还没有账号？", en: "Don't have an account? " },
  "login.signUp": { zh: "注册", en: "Sign Up" },

  // Signup
  "signup.title": { zh: "注册", en: "Sign Up" },
  "signup.subtitle": { zh: "开始你们的信件之旅", en: "Start your letter journey" },
  "signup.nickname": { zh: "昵称", en: "Nickname" },
  "signup.email": { zh: "邮箱", en: "Email" },
  "signup.password": { zh: "密码", en: "Password" },
  "signup.loading": { zh: "注册中...", en: "Signing up..." },
  "signup.submit": { zh: "注册", en: "Sign Up" },
  "signup.checkEmail": { zh: "查看你的邮箱", en: "Check Your Email" },
  "signup.verificationSent": { zh: "我们已发送一封验证邮件到", en: "We've sent a verification email to" },
  "signup.clickLink": { zh: "请点击链接完成注册。", en: "Click the link to complete signup." },
  "signup.backToLogin": { zh: "返回登录", en: "Back to Sign In" },
  "signup.hasAccount": { zh: "已有账号？", en: "Already have an account? " },
  "signup.signIn": { zh: "登录", en: "Sign In" },

  // Pair
  "pair.title": { zh: "配对", en: "Pair" },
  "pair.subtitle": {
    zh: "分享你的邀请码给对方，或输入对方的邀请码",
    en: "Share your invite code, or enter your partner's code",
  },
  "pair.yourCode": { zh: "你的邀请码", en: "Your Invite Code" },
  "pair.copy": { zh: "复制", en: "Copy" },
  "pair.partnerCode": { zh: "输入对方的邀请码", en: "Partner's Code" },
  "pair.loading": { zh: "配对中...", en: "Pairing..." },
  "pair.submit": { zh: "配对", en: "Pair" },
  "pair.failed": { zh: "配对失败，请重试", en: "Pairing failed, please try again" },
  "pair.success": { zh: "配对成功！", en: "Paired!" },
  "pair.pairedWith": { zh: "你已经和", en: "You are now paired with" },
  "pair.writeLetter": { zh: "写一封信", en: "Write a Letter" },

  // Compose
  "compose.noPair": { zh: "你还没有配对，请先完成配对", en: "You haven't paired yet" },
  "compose.goPair": { zh: "去配对", en: "Go Pair" },
  "compose.sent": { zh: "信已送出！", en: "Letter Sent!" },
  "compose.sentTo": { zh: "你的信已发送给", en: "Your letter has been sent to" },
  "compose.writeAnother": { zh: "再写一封", en: "Write Another" },
  "compose.timeline": { zh: "时间线", en: "Timeline" },
  "compose.title": { zh: "写信", en: "Compose" },
  "compose.to": { zh: "写给", en: "To" },
  "compose.placeholder": { zh: "想对 TA 说些什么...", en: "What would you like to say..." },
  "compose.chars": { zh: "字", en: "chars" },
  "compose.loading": { zh: "发送中...", en: "Sending..." },
  "compose.submit": { zh: "发送", en: "Send" },
  "compose.failed": { zh: "发送失败，请重试", en: "Failed to send, please try again" },

  // Timeline
  "timeline.title": { zh: "时间线", en: "Timeline" },
  "timeline.compose": { zh: "写信", en: "Compose" },
  "timeline.noPair": {
    zh: "你还没有配对，先找到你的另一半吧",
    en: "You haven't paired yet. Find your partner first!",
  },
  "timeline.goPair": { zh: "去配对", en: "Go Pair" },
  "timeline.noLetters": { zh: "还没有信件，写一封吧！", en: "No letters yet. Write the first one!" },
  "timeline.writeFirst": { zh: "写第一封信", en: "Write First Letter" },

  // Forgot Password
  "forgot.checkEmail": { zh: "查看你的邮箱", en: "Check Your Email" },
  "forgot.emailSent": {
    zh: "如果该邮箱已注册，你将收到一封重置密码的邮件。",
    en: "If this email is registered, you'll receive a password reset link.",
  },
  "forgot.backToLogin": { zh: "返回登录", en: "Back to Sign In" },
  "forgot.title": { zh: "忘记密码", en: "Forgot Password" },
  "forgot.subtitle": {
    zh: "输入你的邮箱，我们将发送重置链接",
    en: "Enter your email and we'll send a reset link",
  },
  "forgot.email": { zh: "邮箱", en: "Email" },
  "forgot.loading": { zh: "发送中...", en: "Sending..." },
  "forgot.submit": { zh: "发送重置链接", en: "Send Reset Link" },

  // Reset Password
  "reset.success": { zh: "密码已更新", en: "Password Updated" },
  "reset.successMsg": { zh: "你的密码已成功重置。", en: "Your password has been reset." },
  "reset.enterApp": { zh: "进入应用", en: "Enter App" },
  "reset.title": { zh: "重置密码", en: "Reset Password" },
  "reset.subtitle": { zh: "输入你的新密码", en: "Enter your new password" },
  "reset.newPassword": { zh: "新密码", en: "New Password" },
  "reset.loading": { zh: "更新中...", en: "Updating..." },
  "reset.submit": { zh: "更新密码", en: "Update Password" },

  // Letter Detail
  "letter.notFound": { zh: "找不到这封信", en: "Letter not found" },
  "letter.unknown": { zh: "未知", en: "Unknown" },
  "letter.backToTimeline": { zh: "返回时间线", en: "Back to Timeline" },

  // Settings
  "settings.title": { zh: "设置", en: "Settings" },
  "settings.language": { zh: "语言", en: "Language" },
  "settings.changeNickname": { zh: "修改昵称", en: "Change Nickname" },
  "settings.nicknamePlaceholder": { zh: "昵称", en: "Nickname" },
  "settings.saveFailed": { zh: "保存失败", en: "Save failed" },
  "settings.saved": { zh: "已保存", en: "Saved" },
  "settings.saving": { zh: "保存中...", en: "Saving..." },
  "settings.save": { zh: "保存", en: "Save" },
  "settings.changePassword": { zh: "修改密码", en: "Change Password" },
  "settings.newPassword": { zh: "新密码", en: "New Password" },
  "settings.confirmPassword": { zh: "确认密码", en: "Confirm Password" },
  "settings.passwordMismatch": { zh: "密码不一致", en: "Passwords do not match" },
  "settings.passwordTooShort": { zh: "密码至少 6 位", en: "Password must be at least 6 characters" },
  "settings.passwordFailed": { zh: "修改失败", en: "Failed to update password" },
  "settings.passwordUpdated": { zh: "密码已更新", en: "Password updated" },
  "settings.updating": { zh: "修改中...", en: "Updating..." },
  "settings.updatePassword": { zh: "修改密码", en: "Update Password" },
  "settings.pairing": { zh: "配对管理", en: "Pairing" },
  "settings.pairedWith": { zh: "当前配对：", en: "Paired with " },
  "settings.unpair": { zh: "解除配对", en: "Unpair" },
  "settings.unpairConfirm": {
    zh: "确定要解除配对吗？此操作不可撤销。",
    en: "Are you sure? This cannot be undone.",
  },
  "settings.unpairing": { zh: "解除中...", en: "Unpairing..." },
  "settings.confirmUnpair": { zh: "确认解除", en: "Confirm" },
  "settings.cancel": { zh: "取消", en: "Cancel" },
  "settings.notPaired": { zh: "未配对", en: "Not paired" },
  "settings.unpairFailed": { zh: "解除失败", en: "Unpair failed" },
  "settings.unpaired": { zh: "已解除配对", en: "Unpaired" },
} as const;

export type TranslationKey = keyof typeof translations;
export default translations;
