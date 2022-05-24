// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

import * as z from "zod";

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  onLoad() {
    // @ts-ignore
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  onTest() {
    console.log('onTest=============');
    this.getUserInput();
    // this.checkSelfAdd();
    // this.checkSelfAddZod();
    this.checkString();
    this.checkNumber();
    // this.checkBool();
    // this.checkLiteral();
    this.checkObject();
    // this.checkArray();
    // this.safeParse();
    // this.typeGuard();
    // this.checkExtend();
    // this.checkMerge();
    // this.checkPickOmit();
    // this.checkPartial();
    // this.checkDeepPartial();
    // this.checkUnion();
  },
  getUserInput() {
    const createUserSchema = z.object({
      account: z.string().min(1, { message: '缺少账号名称' }),
      name: z.string().min(1, { message: '缺少用户姓名' }),
      password: z.string().min(6, { message: '密码太短 - 至少6个字符' }),
      passwordConfirmation: z.string() .min(1, { message: '缺少确认密码' })
    }).refine((data) => data.password === data.passwordConfirmation, {
      message: '两次密码不匹配',
      path: ['passwordConfirmation'],
    })
    const data = {
      account: 'test',
      name: 'user',
      password: 'qwer1234',
      passwordConfirmation: 'qwer1234',
      extract: 'extract'
    }
    const res = createUserSchema.parse(data);
    console.log('res=======', res);
    type CreateUserInput = Omit<z.TypeOf<typeof createUserSchema>, 'passwordConfirmation'>;
    // { account: string, name: string, password: string }
    const userInput = createUserSchema.omit({ passwordConfirmation: true });
    type UserInput = z.infer<typeof userInput>;
  },
  genArr() {
    const arr = [];
    for (let i = 0; i < 100000; i++) {
      const data = Math.round(Math.random()*100);
      arr.push(data);
      // arr.push({test: data})
    }
    // console.log('arr=======', arr)
    return arr;
  },
  checkSelfAdd() {
    const arr = this.genArr();
    const startTime = Date.now();
    arr.forEach((_, index, ori) => {
      ori[index] += 1;
    })
    // arr.forEach((ele: any, index, ori) => {
    //   ele.test += 1;
    // })
    // console.log('checkSelfAdd arr=======', arr)
    const endTime = Date.now();
    console.log('checkSelfAdd duration', endTime - startTime)
  },
  checkSelfAddZod() {
    const numArray = z.array(z.number());
    const numSchema = z.number();
    const arr = this.genArr();
    const startTime = Date.now();
    // arr.forEach((ele, index, ori) => {
    //   ori[index] = numSchema.parse(ele) + 1;
    //   // ele.test = numSchema.parse(ele.test) + 1;
    // })
    numArray.parse(arr);
    const endTime = Date.now();
    console.log('checkSelfAddZod duration', endTime - startTime)
  },
  checkString() {
    const startTime = Date.now();
    // const mySchema = z.string();
    const mySchema = z.string().max(5, { message: 'too long' });
    for (let i = 0; i < 10000; i++) {
      // mySchema.parse("tuna");
      mySchema.safeParse("tuna fish");
    }
    const endTime = Date.now();
    console.log('checkString duration', endTime - startTime)
  },
  checkNumber() {
    const startTime = Date.now();
    const mySchema = z.number();
    // const mySchema = z.number().positive(); // alias .max(5)
    for (let i = 0; i < 100000; i++) {
      mySchema.parse(i);
      // mySchema.safeParse(-1);
    }
    const endTime = Date.now();
    console.log('checkNumber duration', endTime - startTime)
  },
  checkBool() {
    const startTime = Date.now();
    const mySchema = z.boolean();
    for (let i = 0; i < 10000; i++) {
      mySchema.parse(false);
    }
    const endTime = Date.now();
    console.log('checkBool duration', endTime - startTime)
  },
  checkLiteral() {
    const startTime = Date.now();
    for (let i = 0; i < 10000; i++) {
      z.literal('string');
    }
    const endTime = Date.now();
    console.log('checkLiteral duration', endTime - startTime)
  },
  checkObject() {
    const startTime = Date.now();
    const User = z.object({
      username: z.string(),
    });
    for (let i = 0; i < 10000; i++) {
      User.parse({ test: "test" });
      // 抽出推断的类型
      type User = z.infer<typeof User>;
    }
    const endTime = Date.now();
    console.log('checkObject duration', endTime - startTime)

    // let a = { username: "test" };
    // const foo = (value: User) => {
    //   return value;
    // };
    // foo(a);
  },
  checkArray() {
    const startTime = Date.now();
    const mySchema = z.array(z.string());
    for (let i = 0; i < 10000; i++) {
      mySchema.parse(['a', 'b', 'c']);
    }
    const endTime = Date.now();
    console.log('checkArray duration', endTime - startTime)
  },
  safeParse() {
    const startTime = Date.now();
    const stringSchema = z.string();
    for (let i = 0; i < 10000; i++) {
      stringSchema.safeParse(12);
      stringSchema.safeParse("billie");
    }
    const endTime = Date.now();
    console.log('safeParse duration', endTime - startTime)
  },
  typeGuard() {
    const startTime = Date.now();
    const stringSchema = z.string();
    for (let i = 0; i < 10000; i++) {
      const blob: any = "Albuquerque";
      stringSchema.check(blob)
    }
    const endTime = Date.now();
    console.log('typeGuard duration', endTime - startTime)
  },
  checkExtend() {
    const startTime = Date.now();
    // 所有属性都是默认需要的
    const Dog = z.object({
      name: z.string(),
      age: z.number(),
    });
    // 像这样提取推断出的类型
    type Dog = z.infer<typeof Dog>;
    Dog.shape.name; // => string schema
    Dog.shape.age; // => number schema
    for (let i = 0; i < 10000; i++) {
      const DogWithBreed = Dog.extend({
        breed: z.string()
      });
    }
    const endTime = Date.now();
    console.log('checkExtend duration', endTime - startTime)
  },
  checkMerge() {
    const startTime = Date.now();
    const BaseTeacher = z.object({ students: z.array(z.string()) });
    const HasID = z.object({ id: z.string() });
    for (let i = 0; i < 10000; i++) {
      const Teacher = BaseTeacher.merge(HasID);
      type Teacher = z.infer<typeof Teacher>; // => { students: string[], id: string }
    }
    const endTime = Date.now();
    console.log('checkMerge duration', endTime - startTime)
  },
  checkPickOmit() {
    const startTime = Date.now();
    const Recipe = z.object({
      id: z.string(),
      name: z.string(),
      ingredients: z.array(z.string()),
    });
    for (let i = 0; i < 10000; i++) {
      const JustTheName = Recipe.pick({ name: true });
      type JustTheName = z.infer<typeof JustTheName>;

      const NoIDRecipe = Recipe.omit({ id: true });
      type NoIDRecipe = z.infer<typeof NoIDRecipe>;
    }
    const endTime = Date.now();
    console.log('checkPickOmit duration', endTime - startTime)
  },
  checkPartial() {
    const startTime = Date.now();
    const user = z.object({
      username: z.string(),
    });
    for (let i = 0; i < 10000; i++) {
      const partialUser = user.partial();
    }
    const endTime = Date.now();
    console.log('checkPartial duration', endTime - startTime)
  },
  checkDeepPartial() {
    const startTime = Date.now();
    const user = z.object({
      location: z.object({
        latitude: z.number(),
      }),
    });
    for (let i = 0; i < 10000; i++) {
      const deepPartialUser = user.deepPartial();
    }
    const endTime = Date.now();
    console.log('checkDeepPartial duration', endTime - startTime)
  },
  checkUnion() {
    const startTime = Date.now();
    const stringOrNumber = z.union([z.string(), z.number()]);
    for (let i = 0; i < 10000; i++) {
      stringOrNumber.parse("foo"); // 通过
      // stringOrNumber.parse(14); // 通过
    }
    const endTime = Date.now();
    console.log('checkUnion duration', endTime - startTime)
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e: any) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
