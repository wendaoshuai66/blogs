# ECMAScript5.1 新增语法下

## 额外的数组
### Array.prototype.indexOf


### Array.prototype.lastIndexOf

### Array.prototype.every

### Array.prototype.some

### Array.prototype.forEach

### Array.prototype.map

通常情况下，map 方法中的 callback 函数只需要接受一个参数，就是正在被遍历的数组元素本身。但这并不意味着 map 只给 callback 传了一个参数。这个思维惯性可能会让我们犯一个很容易犯的错误。

```plain
var result=["1", "2", "3"].map(parseInt);
        console.log(result)//[1,NaN,NaN]
        //  惯性思维是[1,2,3]

        //map参数
        //1.callback
        //   回调函数有三个参数：
        //             currentValue
        //               callback 数组中正在处理的当前元素。
        //              index可选
        //                 callback 数组中正在处理的当前元素的索引。
        //               array可选
        //                 callback  map 方法被调用的数组。
        //2.thisArg 执行 callback 函数时使用的this 值。

        // 通常使用parseInt时,只需要传递一个参数.
        // 但实际上,parseInt可以有两个参数.第二个参数是进制数.
        // 可以通过语句"alert(parseInt.length)===2"来验证.
        //解决方法
        //方法一
        function returnInt(ele){
            return parseInt(ele,10)
        }
        console.log(["1", "2", "3"].map(returnInt))
        //方法二
        console.log(["1", "2", "3"].map(val=>parseInt(val)))
        //方法三
        console.log(["1", "2", "3"].map(Number))
```

实现数组中的 map 方法


```plain

 if(!Array.prototype.map){
        Array.prototype.map=function(callback,oThis){
            var A //创建一个新数组
            ,T  //是每个个回调函数执行 callback 函数时使用的this 值
            ,k;
            //首先判断
            if(this===null){
                throw new TypeError('this is null or undefined')
            }
            var o = Object(this);
            var len = o.length;
            if(Object.prototype.toString.call(callback) != "[object Function]"){
                throw new TypeError(callback+ '  is not function')
            }

            A = new Array(len);
            //如果有oThis是oThis，没有T为undefined
            if(oThis){
                T = oThis
            }

            k= 0;
            while(k<len){
                var kValue,deepValue;
                if(k in o){
                    kValue = o[k]
                    deepValue = callback.call(T,kValue,k,o)
                    A[k] = deepValue
                }
                k++
            }
            return A;
        }
       }
```



### Array.prototype.filter

### Array.prototype.reduce
累加对象数组里的值

```plain


    var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];
    var allname=names.reduce((pre,cur)=>{
          (cur in pre) ?pre[cur]++ :pre[cur]=1
          return pre
      },{})
```

实现 reduce

```plain
if(!Array.prototype.reduce){
        Object.defineProperty(Array.prototype,'reduce',{
           value:function (callback) {
               if(this===null){
                   throw new TypeError('this is null or undefined')
               }
               if(typeof callback !=='function'){
                   throw new TypeError(callback+'is not function')
               }
               var o = Object(this)
               var len = o.length;
               var value;
               var k = 0;
               if(arguments>=2){
                   value = arguments[1]
               }else {
                   while (k<len && !(k in o)){
                       k++
                   }
                   if (k >= len) {
                       throw new TypeError( 'Reduce of empty array ' +
                           'with no initial value' );
                   }
                   value = o[k++]
               }
               while (k<len){
                   if(k in o){
                       value = callback(value,o[k],k,o);
                   }
                   k++
               }
               console.log(value)
               return value
           }
       })
      }
```

### Array.prototype.reduceRight