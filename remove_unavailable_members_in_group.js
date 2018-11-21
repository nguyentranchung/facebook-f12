(function() {

    var MemberRemover = {
        init: function() {
            this.members = []
            this.group_id = document.querySelector("meta[property='al:android:url']").getAttribute('content')
            this.group_id = this.group_id.replace("fb://group/", "")
            this.access_token = window.prompt("Nhập Access Token của bạn: ")
            this.dtsg = this.getDtsg()
            this.user_id = this.getUserId()
            this.jazoest = this.getJazoest()
            return this;
        },
        run: async function() {
            var self = this;
            console.info('Bắt đầu!');
            console.info('Đang tìm kiếm....');
            const response = await fetch("https://www.facebook.com/ajax/browser/list/group_confirmed_members/?gid=" + encodeURIComponent(this.group_id) + "&order=default&filter=unavailable_accounts&view=list&limit=10&sectiontype=unavailable&start=0&__a=1", { credentials: "include" })
            const json = await response.text()
            let datas = JSON.parse(json.substring(9))
            datas = datas.jsmods.elements
            console.log(datas)
            for (var i = datas.length - 1; i >= 0; i--) {
                for (var j = datas[i].length - 1; j >= 0; j--) {
                    const account = datas[i][j]
                    if (typeof account == 'string' && account.includes('unavailable_')) {
                        this.members.push(account.substring('unavailable_'.length));
                    }
                }
            }
            console.log(this.members);
            console.log('Tìm thấy: ' + this.members.length + ' thành viên không khả dụng');
            this.removeMembers();
        },
        removeMembers: async function() {
            console.warn('Bắt đầu xóa thành viên....');
            const delayTime = 1000
            let delay = 0
            for (const member of this.members) {
                setTimeout(this.removeMember(member), delay + delayTime)
            }
        },
        removeMember: async function(member) {
            const json = await fetch(`https://graph.facebook.com/${this.group_id}/members?method=delete&member=${member}&access_token=${this.access_token}`, {
                method: "POST"
            })
            console.info('Đã xóa: ' + member)
            return true
            // var data = new FormData;
            // data.append("fb_dtsg", this.dtsg);
            // data.append("jazoest", this.jazoest);
            // data.append("__user", this.user_id);
            // data.append("confirm", !0);
            // data.append("__a", 1);
            // const json = await fetch("https://www.facebook.com/ajax/groups/remove_member/?group_id=" + this.group_id + "&member_id=" + member + "&is_undo=0&source=profile_browser&dpr=1", {
            //     credentials: "include",
            //     body: data,
            //     method: "POST",
            //     referrer: "https://www.facebook.com/groups/167363136987053/unavailable_accounts/",
            //     mode: 'cors'
            // }).then(function() {
            //     console.info('Đã xóa: ' + member);
            // })
            // return json
        },
        getDtsg: function() {
            try {
                return require("DTSGInitialData").token
            } catch (b) {
                var a = document.querySelector('[name="fb_dtsg"]');
                return null !== a ? a.value : null
            }
        },
        getJazoest: function () {
            jazoest = ""
            for (var x = 0; x < this.dtsg.length; x++) {
                jazoest += this.dtsg.charCodeAt(x)
            }
            jazoest = '2' + jazoest
            return jazoest
        },
        getUserId: function() {
            if ("function" !== typeof require) return null;
            try {
                return require("CurrentUserInitialData").USER_ID || document.cookie.match(/c_user=([0-9]+)/)[1]
            } catch (a) {
                return null
            }
        }
    };

    MemberRemover.init().run();

})();
