# Various variables:
SRCDIR			= public
TARGET			= build
CURRENT_DATE	= $(shell date +'%Y/%m/%d')
####################

# Printing format helpers:
RED		= \033[38;5;1m
BLUE	= \033[38;5;6m
GREEN	= \033[38;5;35m
YELLOW	= \033[38;5;11m
RESET	= \033[0m
##########################

$(TARGET):
	@printf "Building site files...\n"
	@printf "$(BLUE)Moving everything into the build directory...$(RESET)\n"
	@cp -rfT public build
	@printf "$(YELLOW)Updating build date to $(CURRENT_DATE)...$(RESET)\n"
	@find $(TARGET) -name "*.html" -exec sed -i "s|__LAST_UPDATED__|$(CURRENT_DATE)|g" {} \;

test:
	@printf "$(RED)---  red  ---$(RESET)\n"
	@printf "$(BLUE)--- bl ue ---$(RESET)\n"
	@printf "$(GREEN)--- green ---$(RESET)\n"
	@printf "$(YELLOW)---yel low---$(RESET)\n"

.PHONY: $(TARGET)