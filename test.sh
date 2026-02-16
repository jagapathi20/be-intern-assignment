#!/bin/bash

# Base URLs
BASE_URL="http://localhost:3000/api"
USERS_URL="$BASE_URL/users"
POSTS_URL="$BASE_URL/posts"
LIKES_URL="$BASE_URL/likes"
FOLLOWS_URL="$BASE_URL/follows"
HASHTAGS_URL="$BASE_URL/hashtags"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${GREEN}=== $1 ===${NC}"
}

# Function to make API requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    echo "Request: $method $endpoint"
    if [ -n "$data" ]; then
        echo "Data: $data"
    fi
    
    if [ "$method" = "GET" ]; then
        curl -s -X $method "$endpoint" | jq .
    else
        curl -s -X $method "$endpoint" -H "Content-Type: application/json" -d "$data" | jq .
    fi
    echo ""
}

# --- USER FUNCTIONS ---
test_get_all_users() {
    print_header "Testing GET all users"
    make_request "GET" "$USERS_URL"
}

test_get_user() {
    print_header "Testing GET user by ID"
    read -p "Enter user ID: " user_id
    make_request "GET" "$USERS_URL/$user_id"
}

test_create_user() {
    print_header "Testing POST create user"
    read -p "Enter first name: " firstName
    read -p "Enter last name: " lastName
    read -p "Enter email: " email
    
    local user_data=$(cat <<EOF
{
    "firstName": "$firstName",
    "lastName": "$lastName",
    "email": "$email"
}
EOF
)
    make_request "POST" "$USERS_URL" "$user_data"
}

test_update_user() {
    print_header "Testing PUT update user"
    read -p "Enter user ID to update: " user_id
    read -p "Enter new first name (press Enter to keep current): " firstName
    read -p "Enter new last name (press Enter to keep current): " lastName
    read -p "Enter new email (press Enter to keep current): " email
    
    local update_data="{"
    local has_data=false
    
    if [ -n "$firstName" ]; then
        update_data+="\"firstName\": \"$firstName\""
        has_data=true
    fi
    if [ -n "$lastName" ]; then
        if [ "$has_data" = true ]; then update_data+=","; fi
        update_data+="\"lastName\": \"$lastName\""
        has_data=true
    fi
    if [ -n "$email" ]; then
        if [ "$has_data" = true ]; then update_data+=","; fi
        update_data+="\"email\": \"$email\""
        has_data=true
    fi
    update_data+="}"
    
    make_request "PUT" "$USERS_URL/$user_id" "$update_data"
}

test_delete_user() {
    print_header "Testing DELETE user"
    read -p "Enter user ID to delete: " user_id
    make_request "DELETE" "$USERS_URL/$user_id"
}

# --- POST FUNCTIONS ---

test_create_post() {
    print_header "Testing POST create post with hashtags"
    read -p "Enter User ID (Author): " user_id
    read -p "Enter Post Content: " content
    read -p "Enter Hashtags (comma separated, e.g. tech,coding): " tags
    
    # Convert comma-separated string into a JSON array format
    # Example: "tech,coding" -> ["tech", "coding"]
    local formatted_tags=$(echo $tags | sed 's/,/","/g' | sed 's/^/["/' | sed 's/$/"]/')
    
    local post_data=$(cat <<EOF
{
    "content": "$content",
    "hashtags": $formatted_tags
}
EOF
)
    # Based on your post.routes.ts: postRouter.post('/:id', ...)
    make_request "POST" "$POSTS_URL/$user_id" "$post_data"
}

test_get_posts_by_hashtag() {
    print_header "Testing GET posts by hashtag"
    read -p "Enter hashtag name (without #): " hashtag_name
    # Based on your post.routes.ts: postRouter.get('/hashtag/:hashtag', ...)
    make_request "GET" "$POSTS_URL/hashtag/$hashtag_name"
}

# --- SUBMENU UPDATE ---
show_posts_menu() {
    echo -e "\n${GREEN}Posts Menu${NC}"
    echo "1. Get post by ID"
    echo "2. Create post (with hashtags)"
    echo "3. Update post"
    echo "4. Delete post"
    echo "5. Get posts by hashtag"
    echo "6. Back"
    echo -n "Choice: "
}

# --- LIKE FUNCTIONS ---
test_toggle_like() {
    print_header "Testing POST toggle like"
    read -p "Enter User ID: " user_id
    read -p "Enter Post ID: " post_id
    make_request "POST" "$LIKES_URL/toggle/$user_id/$post_id" "{}"
}

test_get_post_likes() {
    print_header "Testing GET post likes"
    read -p "Enter Post ID: " post_id
    make_request "GET" "$LIKES_URL/post/$post_id"
}

# --- FOLLOW FUNCTIONS ---
test_toggle_follow() {
    print_header "Testing POST toggle follow"
    read -p "Enter Your User ID: " user_id
    read -p "Enter Target User ID: " target_id
    make_request "POST" "$FOLLOWS_URL/toggle/$user_id/$target_id" "{}"
}

test_get_followers() {
    print_header "Testing GET followers"
    read -p "Enter User ID: " user_id
    make_request "GET" "$FOLLOWS_URL/user/$user_id/followers"
}

# --- FEED & ACTIVITY ---
test_get_feed() {
    print_header "Testing GET feed"
    read -p "Enter User ID: " user_id
    make_request "GET" "$BASE_URL/feed/$user_id"
}

test_get_activity() {
    print_header "Testing GET activity"
    read -p "Enter User ID: " user_id
    make_request "GET" "$BASE_URL/activity/$user_id"
}

# --- SUBMENUS ---
show_users_menu() {
    echo -e "\n${GREEN}Users Menu${NC}"
    echo "1. Get all users"
    echo "2. Get user by ID"
    echo "3. Create user"
    echo "4. Update user"
    echo "5. Delete user"
    echo "6. Back"
    echo -n "Choice: "
}

show_posts_menu() {
    echo -e "\n${GREEN}Posts Menu${NC}"
    echo "1. Get post by ID"
    echo "2. Create post"
    echo "3. Update post"
    echo "4. Delete post"
    echo "5. Back"
    echo -n "Choice: "
}

show_interactions_menu() {
    echo -e "\n${GREEN}Interactions Menu (Likes/Follows)${NC}"
    echo "1. Toggle Like"
    echo "2. Get Post Likes"
    echo "3. Toggle Follow"
    echo "4. Get User Followers"
    echo "5. Back"
    echo -n "Choice: "
}

show_main_menu() {
    echo -e "\n${GREEN}=== API Testing Menu ===${NC}"
    echo "1. Users Management"
    echo "2. Posts Management"
    echo "3. Likes & Follows"
    echo "4. Feed & Activity"
    echo "5. Exit"
    echo -n "Enter choice: "
}

# --- MAIN LOOP ---
while true; do
    show_main_menu
    read choice
    case $choice in
        1)
            while true; do
                show_users_menu
                read user_choice
                case $user_choice in
                    1) test_get_all_users ;;
                    2) test_get_user ;;
                    3) test_create_user ;;
                    4) test_update_user ;;
                    5) test_delete_user ;;
                    6) break ;;
                esac
            done
            ;;
       2)
            while true; do
                show_posts_menu
                read post_choice
                case $post_choice in
                    1) test_get_post ;;
                    2) test_create_post ;;
                    3) test_update_post ;;
                    4) test_delete_post ;;
                    5) test_get_posts_by_hashtag ;;
                    6) break ;;
                esac
            done
            ;;
        3)
            while true; do
                show_interactions_menu
                read int_choice
                case $int_choice in
                    1) test_toggle_like ;;
                    2) test_get_post_likes ;;
                    3) test_toggle_follow ;;
                    4) test_get_followers ;;
                    5) break ;;
                esac
            done
            ;;
        4)
            while true; do
                echo -e "\n${GREEN}Feed & Activity Menu${NC}"
                echo "1. View Feed"
                echo "2. View Activity"
                echo "3. Back"
                read act_choice
                case $act_choice in
                    1) test_get_feed ;;
                    2) test_get_activity ;;
                    3) break ;;
                esac
            done
            ;;
        5) exit 0 ;;
        *) echo "Invalid selection" ;;
    esac
done