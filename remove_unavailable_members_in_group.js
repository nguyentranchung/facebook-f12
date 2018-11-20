(function(group_id) {

    var MemberRemover = {
        init: function() {
            this.members = [];
            this.dtsg = this.getDtsg();
            this.user_id = this.getUserId();
            return this;
        },
        run: async function() {
            var self = this;
            console.info('Bắt đầu!');
            console.info('Đang tìm kiếm....');
            const response = await fetch("https://www.facebook.com/ajax/browser/list/group_confirmed_members/?gid=" + encodeURIComponent(group_id) + "&order=default&filter=unavailable_accounts&view=list&limit=10&sectiontype=unavailable&start=0&__a=1", { credentials: "include" })
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
            for (const member of this.members) {
                await this.removeMember(member)
            }
        },
        removeMember: async function(member) {
            var data = new FormData;
            data.append("fb_dtsg", this.dtsg);
            data.append("__user", this.user_id);
            data.append("confirm", !0);
            data.append("__a", 1);
            const json = await fetch("https://www.facebook.com/ajax/groups/remove_member/?group_id=" + group_id + "&member_id=" + member + "&is_undo=0&source=profile_browser&dpr=1", {
                credentials: "include",
                body: data,
                method: "POST",
                referrer: "https://www.facebook.com/groups/167363136987053/unavailable_accounts/",
                mode: 'cors'
            }).then(function() {
                console.info('Đã xóa: ' + member);
            })
            return json
        },
        getDtsg: function() {
            try {
                return require("DTSGInitialData").token
            } catch (b) {
                var a = document.querySelector('[name="fb_dtsg"]');
                return null !== a ? a.value : null
            }
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

})("167363136987053");
