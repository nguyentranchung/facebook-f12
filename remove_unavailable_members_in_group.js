(function (group_id) {

    var MemberRemover = {
        init:function(){
            this.members = [];
            this.dtsg = this.getDtsg();
            this.user_id = this.getUserId();
            return this;
        },
        run:function(){
            var self=this;
            console.info('Bắt đầu!');
            console.info('Đang tìm kiếm....');
            fetch("https://www.facebook.com/ajax/browser/list/group_confirmed_members/?gid=" + encodeURIComponent(group_id) + "&order=default&filter=unavailable_accounts&view=list&limit=500&sectiontype=unavailable&start=0&__a=1", {credentials: "include"}).then(function (response) {
                return response.text()
            }).then(function (payload) {
                for (var regex =
                    /id=\\"unavailable_([0-9]+)\\"/g, matches = regex.exec(payload); null != matches;)
                    self.members.push(matches[1]), matches = regex.exec(payload);
                // console.log(self.members);
                console.log('Tìm thấy: '+self.members.length+' thành viên không khả dụng');
                self.removeMembers();

            })
        },
        removeMembers:function () {
            console.warn('Bắt đầu xóa thành viên....');
            var members = this.members;
            for (const member of members) {
                this.removeMember(member)
            }
            console.warn('Xóa thành công ' + members.length + ' thành viên!');
        },
        removeMember: async function (member) {
            var data = new FormData;
            data.append("fb_dtsg", this.dtsg);
            data.append("__user", this.user_id);
            data.append("confirm", !0);
            data.append("__a", 1);
            return fetch("https://www.facebook.com/ajax/groups/members/remove.php?group_id=" + group_id + "&user_id=" + member + "&is_undo=0&source=profile_browser&dpr=1", {
                credentials: "include",
                body: data,
                method: "POST"
            }).then(function () {
                console.info('Đã xóa: '+member);
            })
        },
        getDtsg:function () {
            try {
                return require("DTSGInitialData").token
            } catch (b) {
                var a = document.querySelector('[name="fb_dtsg"]');
                return null !== a ? a.value : null
            }
        },
        getUserId:function(){
            if ("function" !== typeof require) return null;
            try {
                return require("CurrentUserInitialData").USER_ID || document.cookie.match(/c_user=([0-9]+)/)[1]
            } catch (a) {
                return null
            }
        }
    };

    MemberRemover.init().run();

})(YOUR_GROUP_ID);