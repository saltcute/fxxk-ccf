/**
 * Created by weizhuo on 2017/1/12. 三种使用方式 <body> name:<input type="text"
 * name="name" id="name" >
 * <p id="error_name">
 * </p>
 * age:<input type="text" name="age" >
 * <p id="error_age">
 * </p>
 * email:<input type="text" name="email" id="email" >
 * <p id="error_email">
 * </p>
 * telePhone:<input type="text" name="telePhone" >
 * <p id="error_telePhone">
 * </p>
 * <input type="button" id="save" value="save"> </body> <script> var formCheck =
 * new FormCheck(); //为 id 为name的输入框添加blur事件，默认错误展示元素为$("#error_元素的name属性值")
 * //不可为空，不能包含非法字符,24个字以内 formCheck.addEvent("#name", "blur", {
 * 
 * require:true, character:true, minlen:4, maxlen:24 }) //为
 * name='age'的输入框添加blur事件，默认错误展示元素为$("#error_age") //不可为空，最大值为99
 * formCheck.addEvent("input[name='age']", "blur", { name:"age", require:true,
 * number:true, min:18, max:99 }) formCheck.addEvent("input[name='telePhone']",
 * "blur", { name:"手机", require:true, regex_code :'cellphone' })
 * formCheck.addSelfEvent("#email", "blur", function() {//此处可添加定义自己的执行方法 return
 * FormCheck.checkField( '#email', { name:'email', require:true,
 * regex:/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
 * regex_msg:'请输入正确的email' }); }) formCheck.addEvent("input[name='url']",
 * "blur", { name:"url", require:true, regex_code :'url' })
 * $("#save").click(function(){ if(formCheck.checkForm());{ $("#form").submit(); } })
 * </script>
 */
(function ($, window, undefined) {
    var regex_character = /[`~%!@#^=''?~！@#￥……&——‘”“'？*()（），,。.、///+/-]/;
    var OPTS_REGEX = {
        cellphone: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        card: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i,
        post: /^[0-9]{6}$/,
        email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    };

    function FormCheck() {
        var me = this;
        var arryFn = [];
        /* 添加自定义校验,撤销支持this */
        me.addSelfEvent = function (ele, event, fn) {
            if (common.checkFn(fn) && common.checkElm(ele)) {
                $(ele).bind(event, fn);
                arryFn.push(fn);
            }
        };
        /*
         * 绑定校验
         * @Param ele ：校验任何满足jquery查找元素规则的元素$(ele)，
         * @Param event :绑定事件 change click blur
         * @Param options : json 校验规则 :{
         * name：校验属性的中文名，做默认提示用
         * error_ele:undefined,
         * require:false,
         * require_msg:"{name}不能为空",
         * regex:undefined,
         * regex_msg:"{name}格式不正确",
         * regex_code:undefined,
         * regex_code_msg:"{name}格式不正确",
         * number:false,
         * number_msg:"{name}非法的数字格式",
         * character:false,
         * character_msg:"{name}不能包含非法字符",
         * maxlen:undefined,
         * maxlen_msg: "{name}最多可以输入 {0} 个字符",
         * minlen:undefined,
         * minlen_msg: "{name}最少要输入{0} 个字符",
         * rangelen :undefined,
         * rangelen_msg:"{name}请输入长度在 {0} 到 {1}之间的字符串",
         * range_msg:"{name}请输入范围在 {0} 到 {1} 之间的数值",
         * max:undefined,
         * max_msg: "{name}请输入不大于 {0} 的数值",
         * min:undefined,
         * min_msg:"{name}请输入不小于 {0} 的数值"}
         */
        me.addEvent = function (ele, event, options) {
            if (common.checkElm(ele)) {
                $(ele).bind(event, function () {
                    return FormCheck.check(ele, options);
                });
                arryFn.push(function () {
                    return FormCheck.check(ele, options);
                });
            }
        };
        /* 执行所有添加到对应form(arryFn[])中的检查事件方法，并将其执行结果依次相&&得到返回值 true/false */
        me.checkForm = function () {
            var falg = true;
            for (var i = 0; i < arryFn.length; i++) {
                falg = arryFn[i]() && falg;
            }
            return falg;
        };
        /* 清除所有eles中元素的前后空格获得的值并重新为元素赋值 */
        me.trims = function (eles) {
            $.each(eles, function () {
                $(this).val($.trim($(this).val()));
            });
        };
    }
    ;
    FormCheck.check = function (ele, options) {
        if (options && options.select) {
            return FormCheck.checkSelect(ele, options);
        } else {
            return FormCheck.checkField(ele, options);
        }
    };

    FormCheck.checkSelect = function (fieldEle, options) {
        var opts = {
            name: "",
            error_ele: undefined,
            require: false,
            min_size: 0,
            require_msg: "{name}不能为空",
        };
        opts = $.extend(opts, options || {});
        var ele = $(fieldEle);
        var errorEle = opts.error_ele ? $(opts.error_ele) : $("#error_"
            + ele.attr("name"));// 错误显示元素id 为 error_元素的name值
        var value = ele.val();
        var size = ele.children().length;
        if (opts.require && (size > opts.min_size) && isEmpty(value)) {// 1.判断属性是否为空
            message.show(ele, errorEle, message.formatMsg(opts.name,
                opts.require_msg));
            return false;
        }
        errorEle.html("");
        ele.removeClass("parsley-error");
        return true;
    };
    /*
     * 验证字符串类型的属性方法 fieldEle：属性元素任何jquery获取方式("#id","input[name='name']")等；
     * fieldChinaName:属性中文名字做默认错误提示用。 character非法字符 name：校验属性的中文名，做默认提示用
     * error_ele:提示错误的元素容器，不传入默认为属性的 $("#error_属性的name值").html("xxx不可为空等")。
     */
    FormCheck.checkField = function (fieldEle, options) {
        var opts = {
            name: "",
            error_ele: undefined,
            require: false,
            require_msg: "{name}不能为空",
            regex: undefined,
            regex_msg: "{name}格式不正确",
            regex_code: undefined,
            regex_code_msg: "{name}格式不正确",
            number: false,
            number_msg: "{name}非法的数字格式",
            character: false,
            character_msg: "{name}不能包含非法字符",
            maxlen: undefined,
            maxlen_msg: "{name}最多可以输入{0}个字符",
            minlen: undefined,
            minlen_msg: "{name}最少要输入{0}个字符",
            rangelen: undefined,
            rangelen_msg: "{name}请输入长度在{0}到{1}之间的字符串",
            range_msg: "{name}请输入范围在 {0}到{1}之间的数值",
            max: undefined,
            max_msg: "{name}请输入不大于{0}的数值",
            min: undefined,
            min_msg: "{name}请输入不小于{0}的数值"
        };
        opts = $.extend(opts, options || {});
        var ele = $(fieldEle);
        var errorEle = opts.error_ele ? $(opts.error_ele) : $("#error_" + ele.attr("name"));// 错误显示元素id 为 error_元素的name值
        var value = ele.val();

        if (opts.require && isEmpty(value)) {// 1.判断属性是否为空
            message.show(ele, errorEle, message.formatMsg(opts.name, opts.require_msg));
            return false;
        }
        if (isNotEmpty(ele.attr('type')) && ele.attr('type') != 'file' && ele.attr('type') != 'FILE') {// 非文件控件，清除前后空格并重新赋值给元素
            value = $.trim(value);
            ele.val(value);
        }
        if (opts.regex && isNotEmpty(value) && (!executeReg(value, opts.regex))) {// 判断是否要执行正则
            message.show(ele, errorEle, message.formatMsg(opts.name,
                opts.regex_msg));
            return false;
        }
        if (opts.number && isNotEmpty(value) && (isNaN(value))) {// 判断是否为数字
            message.show(ele, errorEle, message.formatMsg(opts.name,
                opts.number_msg));
            return false;
        }
        if (opts.regex_code && isNotEmpty(value)
            && (!executeReg(value, getRegex(opts.regex_code)))) {// 判断是否为手机格式
            message.show(ele, errorEle, message.formatMsg(opts.name,
                opts.regex_code_msg));
            return false;
        }

        if (opts.character && isNotEmpty(value)
            && executeReg(value, regex_character)) {// 是否包含非法字符
            message.show(ele, errorEle, message.formatMsg(opts.name,
                opts.character_msg));
            return false;
        }
        if (opts.minlen
            && opts.maxlen
            && isNotEmpty(value)
            && ((value.length < opts.minlen) || (value.length > opts.maxlen))) {// 长度范围是否满足
            message.show(ele, errorEle, message.formatMsg(opts.name,
                opts.rangelen_msg, [opts.minlen, opts.maxlen]));
            return false;
        }

        if (opts.minlen && isNotEmpty(value) && (value.length < opts.minlen)) {// 最小长度
            message.show(ele, errorEle, message.formatMsg(opts.name,
                opts.minlen_msg, [opts.minlen]));
            return false;
        }

        if (opts.maxlen && isNotEmpty(value) && (value.length > opts.maxlen)) {// 最大长度
            message.show(ele, errorEle, message.formatMsg(opts.name,
                opts.maxlen_msg, [opts.maxlen]));
            return false;
        }
        if (opts.min && opts.max && isNotEmpty(value)
            && ((value < opts.min) || (value > opts.max))) {// 大小范围是否满足
            message.show(ele, errorEle, message.formatMsg(opts.name,
                opts.range_msg, [opts.min, opts.max]));
            return false;
        }

        if (opts.min && isNotEmpty(value) && (value < opts.min)) {// 最小值
            message.show(ele, errorEle, message.formatMsg(opts.name,
                opts.min_msg, [opts.min]));
            return false;
        }

        if (opts.max && isNotEmpty(value) && (value > opts.max)) {// 最大值
            message.show(ele, errorEle, message.formatMsg(opts.name,
                opts.max_msg, [opts.max]));
            return false;
        }

        errorEle.html("");
        ele.removeClass("parsley-error");
        return true;
    };

    /* 判断是否为空 */
    function isEmpty(val) {
        val = $.trim(val);
        if (val == '' || val == null || typeof val === "undefined"
            || typeof val === "null" || val.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    function isNotEmpty(val) {
        return !isEmpty(val);
    }

    function message() {

    }
    ;
    message.formatMsg = function (filedChinaName, msg, args) {
        if (args) {
            var count = args.length;
            for (var i = 0; i < count; i++) {
                msg = msg.replace('{' + i + '}', args[i]);
            }
        }
        return msg.replace('{name}', filedChinaName);
        ;
    };
    message.show = function (ele, eleError, msg) {
        eleError.html(msg);
        ele.addClass("parsley-error");
        eleError.show();
    };

    /* 需要执行的正则 */
    function executeReg(arr, reg) {
        var patt = new RegExp(reg);
        return patt.test(arr);
        /*
         * var match = arr.match(reg); if (match) { return true; } else { return
         * false; }
         */
    }

    function getRegex(code) {
        var regex = OPTS_REGEX[code];
        if (regex) {
            return regex;
        } else {
            console.error(code + "：未找到定义的regex_code");
        }
    }

    function common() {
    }

    /* 检测传入参数是否是function */
    common.checkFn = function (fn) {
        if (typeof fn === "function") {
            return true;
        } else {
            console.error(fn + "：非法的方法输入参数");
            return false;
        }
    };
    /* 检测元素是否存在 */
    common.checkElm = function (elm) {
        if ($(elm).length > 0) {
            return true;
        } else {
            console.error(elm + "：不存在该元素");
            return false;
        }
    };
    window['FormCheck'] = FormCheck;
})(jQuery, window);